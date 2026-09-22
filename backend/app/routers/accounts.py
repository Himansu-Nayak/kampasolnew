from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.database import get_db
from backend.app.models import DayBookEntry, ExpenseVoucher, Quotation
from backend.app.schemas.schemas import DayBookCreate, ExpenseCreate
import datetime, random

router = APIRouter(prefix="/api/accounts", tags=["Accounts & Finance"])

@router.get("/day-book")
@router.get("/daybook")
def list_day_book(db: Session = Depends(get_db)):
    return db.query(DayBookEntry).order_by(DayBookEntry.entry_date.desc(), DayBookEntry.id.desc()).all()

@router.post("/day-book")
def create_day_book_entry(data: DayBookCreate, db: Session = Depends(get_db)):
    entry = DayBookEntry(
        entry_date=data.entry_date or datetime.date.today(),
        voucher_type=data.voucher_type,
        account_name=data.account_name,
        party_name=data.party_name,
        debit=data.debit or 0.0,
        credit=data.credit or 0.0,
        payment_mode=data.payment_mode,
        reference_no=data.reference_no,
        narration=data.narration
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry

@router.get("/expenses")
def list_expenses(db: Session = Depends(get_db)):
    return db.query(ExpenseVoucher).order_by(ExpenseVoucher.id.desc()).all()

@router.post("/expenses")
def create_expense(data: ExpenseCreate, db: Session = Depends(get_db)):
    vno = f"EXP-{random.randint(1000, 9999)}"
    ev = ExpenseVoucher(
        voucher_no=vno,
        category=data.category,
        amount=data.amount,
        paid_to=data.paid_to,
        payment_mode=data.payment_mode,
        status="Approved",
        description=data.description
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev

@router.get("/gst-summary")
def get_gst_summary(db: Session = Depends(get_db)):
    """GST R1, R2, R3B report as specified in PDF/Video"""
    quotes = db.query(Quotation).all()
    taxable_sales = sum(q.subtotal for q in quotes)
    gst_collected = sum(q.gst_amount for q in quotes)
    
    # Input tax credit from purchases/expenses
    expenses = db.query(ExpenseVoucher).all()
    taxable_purchases = sum(e.amount for e in expenses)
    itc_available = round(taxable_purchases * 0.18, 2)
    
    net_gst_payable = max(0.0, round(gst_collected - itc_available, 2))

    return {
        "gstr1_outward_supplies": {
            "total_taxable_value": taxable_sales,
            "igst": 0.0,
            "cgst": round(gst_collected / 2, 2),
            "sgst": round(gst_collected / 2, 2),
            "total_gst": gst_collected
        },
        "gstr2_inward_supplies": {
            "total_purchases": taxable_purchases,
            "itc_available": itc_available
        },
        "gstr3b_net_liability": {
            "output_tax": gst_collected,
            "input_tax_credit": itc_available,
            "net_payable": net_gst_payable
        }
    }
