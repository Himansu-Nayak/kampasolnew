from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models import (
    Product, StockTransaction, PurchaseOrder, GoodsReceivedNote,
    DeliveryChallan, MaterialIssue, UserActivity
)
from backend.app.schemas.schemas import (
    ProductCreate, MaterialIssueCreate, PurchaseOrderCreate, GRNCreate
)
import random, datetime

router = APIRouter(prefix="/api/erp", tags=["ERP & Inventory"])

@router.get("/products")
def list_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.post("/products")
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    p = Product(
        item_code=data.item_code,
        name=data.name,
        category=data.category,
        uom=data.uom,
        unit_price=data.unit_price,
        cost_price=data.cost_price,
        current_stock=max(0.0, data.current_stock or 0.0),
        min_level=data.min_level,
        max_level=data.max_level,
        warehouse=data.warehouse,
        is_serialized=data.is_serialized,
        barcode=data.barcode
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

@router.get("/transactions")
def list_stock_transactions(db: Session = Depends(get_db)):
    return db.query(StockTransaction).order_by(StockTransaction.id.desc()).limit(50).all()

@router.post("/material-issues")
def issue_material(data: MaterialIssueCreate, db: Session = Depends(get_db)):
    """
    CRITICAL FIX for legacy bug:
    Enforce stock availability check before issuing material so stock NEVER goes negative!
    """
    product = db.query(Product).filter(Product.id == data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if product.current_stock < data.quantity:
        raise HTTPException(
            status_code=400,
            detail=f"Insufficient stock! Available: {product.current_stock} {product.uom}, Requested: {data.quantity}"
        )
    
    # Deduct stock safely
    product.current_stock -= data.quantity
    
    issue_no = f"MI-{random.randint(1000, 9999)}"
    mi = MaterialIssue(
        issue_no=issue_no,
        project_id=data.project_id,
        issued_to=data.issued_to,
        issue_type=data.issue_type,
        status="Issued",
        items_json=f'[{{"item": "{product.name}", "qty": {data.quantity}, "uom": "{product.uom}"}}]'
    )
    db.add(mi)
    
    # Record transaction
    st = StockTransaction(
        product_id=product.id,
        product_name=product.name,
        transaction_type="Material Issue",
        quantity=-data.quantity,
        balance_after=product.current_stock,
        reference_no=issue_no,
        warehouse=product.warehouse,
        notes=f"Issued to {data.issued_to} for {data.project_id}"
    )
    db.add(st)
    db.commit()
    
    return {"message": "Material issued successfully", "issue_no": issue_no, "balance_stock": product.current_stock}

@router.get("/material-issues")
def list_material_issues(db: Session = Depends(get_db)):
    return db.query(MaterialIssue).order_by(MaterialIssue.id.desc()).all()

@router.get("/purchase-orders")
def list_purchase_orders(db: Session = Depends(get_db)):
    return db.query(PurchaseOrder).order_by(PurchaseOrder.id.desc()).all()

@router.post("/purchase-orders")
def create_purchase_order(data: PurchaseOrderCreate, db: Session = Depends(get_db)):
    po_no = f"PO-2026-{random.randint(100, 999)}"
    po = PurchaseOrder(
        po_no=po_no,
        vendor_name=data.vendor_name,
        total_amount=data.total_amount,
        status="Approved",
        items_json=data.items_json
    )
    db.add(po)
    db.commit()
    db.refresh(po)
    return po

@router.get("/grn")
def list_grn(db: Session = Depends(get_db)):
    return db.query(GoodsReceivedNote).order_by(GoodsReceivedNote.id.desc()).all()

@router.post("/grn")
def create_grn(data: GRNCreate, db: Session = Depends(get_db)):
    grn_no = f"GRN-{random.randint(1000, 9999)}"
    grn = GoodsReceivedNote(
        grn_no=grn_no,
        po_no=data.po_no,
        vendor_name=data.vendor_name,
        vehicle_no=data.vehicle_no,
        gate_pass_no=data.gate_pass_no or f"GP-{random.randint(100, 999)}",
        status="Accepted",
        notes=data.notes,
        items_json=data.items_json
    )
    db.add(grn)
    db.commit()
    db.refresh(grn)
    return grn

@router.get("/delivery-challans")
def list_delivery_challans(db: Session = Depends(get_db)):
    return db.query(DeliveryChallan).order_by(DeliveryChallan.id.desc()).all()
