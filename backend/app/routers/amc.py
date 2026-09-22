from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import AMCContract
from backend.app.schemas.schemas import AMCContractCreate
import random

router = APIRouter(prefix="/api/amc", tags=["AMC"])

@router.get("/contracts")
def list_amc_contracts(db: Session = Depends(get_db)):
    return db.query(AMCContract).all()

@router.post("/contracts")
def create_amc_contract(data: AMCContractCreate, db: Session = Depends(get_db)):
    cno = f"AMC-2026-{random.randint(100, 999)}"
    contract = AMCContract(
        contract_no=cno,
        customer_name=data.customer_name,
        customer_mobile=data.customer_mobile,
        customer_email=data.customer_email,
        asset_name=data.asset_name,
        contract_type=data.contract_type,
        end_date=data.end_date,
        total_visits=data.total_visits,
        completed_visits=0,
        total_amount=data.total_amount,
        status="Active"
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract
