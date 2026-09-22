from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import ComplaintTicket, SpareRequisition
from backend.app.schemas.schemas import ComplaintTicketCreate, ComplaintOTPVerify, SpareRequisitionCreate
import random, datetime

router = APIRouter(prefix="/api/complaints", tags=["Complaints & Service"])

@router.get("/tickets")
def list_tickets(db: Session = Depends(get_db)):
    return db.query(ComplaintTicket).order_by(ComplaintTicket.id.desc()).all()

@router.post("/tickets")
def create_ticket(data: ComplaintTicketCreate, db: Session = Depends(get_db)):
    tno = f"TK-{random.randint(1000, 9999)}"
    otp = str(random.randint(1000, 9999))
    ticket = ComplaintTicket(
        ticket_no=tno,
        customer_name=data.customer_name,
        customer_mobile=data.customer_mobile,
        address=data.address,
        product_name=data.product_name,
        issue_description=data.issue_description,
        service_type=data.service_type,
        priority=data.priority,
        status="New",
        assigned_technician=data.assigned_technician,
        otp_code=otp
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

@router.put("/tickets/{ticket_id}/assign")
def assign_technician(ticket_id: int, technician: str, db: Session = Depends(get_db)):
    t = db.query(ComplaintTicket).filter(ComplaintTicket.id == ticket_id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Ticket not found")
    t.assigned_technician = technician
    t.status = "Open"
    db.commit()
    return {"message": "Technician assigned", "status": "Open", "assigned_technician": technician}

@router.post("/tickets/verify-otp-close")
def verify_otp_and_close(data: ComplaintOTPVerify, db: Session = Depends(get_db)):
    """OTP based secure complaint closure as specified in PDF/Video"""
    t = db.query(ComplaintTicket).filter(ComplaintTicket.ticket_no == data.ticket_no).first()
    if not t:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    if t.otp_code != data.otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP code entered!")
    
    t.is_otp_verified = True
    t.status = "Closed"
    t.resolution_notes = data.resolution_notes or "Resolved on site. Customer verified via OTP."
    t.closed_at = datetime.datetime.now(datetime.timezone.utc)
    db.commit()
    return {"message": "Complaint successfully closed and verified via OTP!", "ticket_no": t.ticket_no}

@router.get("/spare-requisitions")
def list_spare_requisitions(db: Session = Depends(get_db)):
    return db.query(SpareRequisition).order_by(SpareRequisition.id.desc()).all()

@router.post("/spare-requisitions")
def create_spare_requisition(data: SpareRequisitionCreate, db: Session = Depends(get_db)):
    sr = SpareRequisition(
        ticket_no=data.ticket_no,
        part_name=data.part_name,
        quantity=data.quantity,
        requested_by=data.requested_by,
        status="Pending"
    )
    db.add(sr)
    db.commit()
    db.refresh(sr)
    return sr

@router.put("/spare-requisitions/{sr_id}/approve")
def approve_spare_requisition(sr_id: int, db: Session = Depends(get_db)):
    sr = db.query(SpareRequisition).filter(SpareRequisition.id == sr_id).first()
    if not sr:
        raise HTTPException(status_code=404, detail="Requisition not found")
    sr.status = "Approved"
    db.commit()
    return {"message": "Requisition approved", "status": "Approved"}
