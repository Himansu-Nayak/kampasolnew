from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import Lead, FollowUp, Meeting, Quotation, SalesOrder, UserActivity
from backend.app.schemas.schemas import (
    LeadCreate, FollowUpCreate, MeetingCreate, QuotationCreate, SalesOrderCreate
)
import datetime, random

router = APIRouter(prefix="/api/crm", tags=["CRM"])

@router.get("/leads")
def list_leads(db: Session = Depends(get_db)):
    return db.query(Lead).order_by(Lead.id.desc()).all()

@router.post("/leads")
def create_lead(lead: LeadCreate, db: Session = Depends(get_db)):
    code = f"SN-LD-{random.randint(1000, 9999)}"
    new_lead = Lead(
        lead_code=code,
        name=lead.name,
        company_name=lead.company_name,
        email=lead.email,
        mobile=lead.mobile,
        source=lead.source,
        stage=lead.stage,
        assigned_user=lead.assigned_user,
        product_interest=lead.product_interest,
        expected_value=lead.expected_value,
        notes=lead.notes
    )
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    
    # Audit log
    db.add(UserActivity(
        user_name=lead.assigned_user or "Admin",
        action="Create Lead",
        module="CRM",
        details=f"Created lead {code} for {lead.name}"
    ))
    db.commit()
    return new_lead

@router.put("/leads/{lead_id}/stage")
def update_lead_stage(lead_id: int, stage: str, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    lead.stage = stage
    db.commit()
    return {"message": "Stage updated", "stage": stage}

@router.get("/followups")
def list_followups(db: Session = Depends(get_db)):
    return db.query(FollowUp).order_by(FollowUp.id.desc()).all()

@router.post("/followups")
def create_followup(data: FollowUpCreate, db: Session = Depends(get_db)):
    f = FollowUp(
        lead_id=data.lead_id,
        lead_code=data.lead_code,
        lead_name=data.lead_name,
        user_name=data.user_name,
        followup_type=data.followup_type,
        followup_date=data.followup_date or datetime.date.today(),
        notes=data.notes,
        next_date=data.next_date
    )
    db.add(f)
    db.commit()
    db.refresh(f)
    return f

@router.get("/meetings")
def list_meetings(db: Session = Depends(get_db)):
    return db.query(Meeting).order_by(Meeting.meeting_date.desc()).all()

@router.post("/meetings")
def create_meeting(data: MeetingCreate, db: Session = Depends(get_db)):
    m = Meeting(
        title=data.title,
        client_name=data.client_name,
        user_name=data.user_name,
        meeting_date=data.meeting_date,
        meeting_time=data.meeting_time,
        location=data.location,
        status=data.status,
        outcome=data.outcome
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

@router.get("/quotations")
def list_quotations(db: Session = Depends(get_db)):
    return db.query(Quotation).order_by(Quotation.id.desc()).all()

@router.post("/quotations")
def create_quotation(data: QuotationCreate, db: Session = Depends(get_db)):
    qno = f"QT-2026-{random.randint(100, 999)}"
    q = Quotation(
        quote_no=qno,
        customer_name=data.customer_name,
        company_name=data.company_name,
        email=data.email,
        mobile=data.mobile,
        subtotal=data.subtotal,
        gst_rate=data.gst_rate,
        gst_amount=data.gst_amount,
        grand_total=data.grand_total,
        status="In Process",
        items_json=data.items_json
    )
    db.add(q)
    db.commit()
    db.refresh(q)
    return q

@router.get("/orders")
def list_sales_orders(db: Session = Depends(get_db)):
    return db.query(SalesOrder).order_by(SalesOrder.id.desc()).all()

@router.post("/orders")
def create_sales_order(data: SalesOrderCreate, db: Session = Depends(get_db)):
    ono = f"SO-{random.randint(100, 999)}"
    so = SalesOrder(
        order_no=ono,
        quote_no=data.quote_no,
        customer_name=data.customer_name,
        total_amount=data.total_amount,
        status=data.status or "Pending",
        delivery_date=data.delivery_date
    )
    db.add(so)
    db.commit()
    db.refresh(so)
    return so
