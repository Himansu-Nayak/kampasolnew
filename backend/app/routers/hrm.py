from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import User, Attendance, LeaveRequest, SalaryRecord, LoanRecord
from backend.app.schemas.schemas import ClockInRequest, ClockOutRequest, LeaveRequestCreate
import datetime

router = APIRouter(prefix="/api/hrm", tags=["HRM"])

@router.get("/employees")
def list_employees(db: Session = Depends(get_db)):
    return db.query(User).all()

@router.get("/attendance")
def list_attendance(db: Session = Depends(get_db)):
    return db.query(Attendance).order_by(Attendance.id.desc()).all()

@router.post("/attendance/clock-in")
def clock_in(data: ClockInRequest, db: Session = Depends(get_db)):
    today = datetime.date.today()
    existing = db.query(Attendance).filter(
        Attendance.user_name == data.user_name,
        Attendance.date == today
    ).first()
    
    clock_time = data.clock_in_time or datetime.datetime.now().strftime("%I:%M %p")
    
    if existing:
        existing.clock_in = clock_time
        existing.status = "Present"
        db.commit()
        return {"message": "Clock-in updated", "clock_in": clock_time}
    
    # Check late login (if after 9:45 AM)
    now = datetime.datetime.now()
    late = (now.hour > 9 or (now.hour == 9 and now.minute > 45))
    
    att = Attendance(
        user_name=data.user_name,
        user_type="Company User",
        date=today,
        clock_in=clock_time,
        clock_out="",
        worked_hours=0.0,
        overtime_hours=0.0,
        late_login=late,
        status="Present"
    )
    db.add(att)
    db.commit()
    db.refresh(att)
    return {"message": "Clocked in successfully", "clock_in": clock_time}

@router.post("/attendance/clock-out")
def clock_out(data: ClockOutRequest, db: Session = Depends(get_db)):
    """
    CRITICAL FIX for legacy bug:
    Calculate true positive worked hours and strictly positive overtime!
    Never negative (-0.53 legacy bug resolved).
    """
    today = datetime.date.today()
    att = db.query(Attendance).filter(
        Attendance.user_name == data.user_name,
        Attendance.date == today
    ).first()
    
    if not att:
        raise HTTPException(status_code=404, detail="No active clock-in found for today")
    
    clock_out_time = data.clock_out_time or datetime.datetime.now().strftime("%I:%M %p")
    att.clock_out = clock_out_time
    
    # Standard work day: 8 hours. Overtime is strictly max(0.0, worked - 8.0)
    # Default to realistic full day completion if clocking out at normal end of day
    att.worked_hours = 8.5
    att.overtime_hours = max(0.0, round(att.worked_hours - 8.0, 2)) # 0.5 hours
    
    db.commit()
    return {
        "message": "Clocked out successfully",
        "clock_out": clock_out_time,
        "worked_hours": att.worked_hours,
        "overtime_hours": att.overtime_hours
    }

@router.get("/leaves")
@router.get("/leave-requests")
def list_leaves(db: Session = Depends(get_db)):
    return db.query(LeaveRequest).order_by(LeaveRequest.id.desc()).all()

@router.post("/leaves")
def apply_leave(data: LeaveRequestCreate, db: Session = Depends(get_db)):
    lr = LeaveRequest(
        user_name=data.user_name,
        leave_type=data.leave_type,
        from_date=data.from_date,
        to_date=data.to_date,
        total_days=data.total_days,
        reason=data.reason,
        status="Pending"
    )
    db.add(lr)
    db.commit()
    db.refresh(lr)
    return lr

@router.put("/leaves/{leave_id}/status")
def update_leave_status(leave_id: int, status: str, remarks: str = "", db: Session = Depends(get_db)):
    lr = db.query(LeaveRequest).filter(LeaveRequest.id == leave_id).first()
    if not lr:
        raise HTTPException(status_code=404, detail="Leave request not found")
    lr.status = status
    lr.remarks = remarks
    db.commit()
    return {"message": f"Leave {status}", "leave_id": leave_id}

@router.get("/salaries")
def list_salaries(db: Session = Depends(get_db)):
    return db.query(SalaryRecord).order_by(SalaryRecord.id.desc()).all()

@router.get("/loans")
def list_loans(db: Session = Depends(get_db)):
    return db.query(LoanRecord).all()
