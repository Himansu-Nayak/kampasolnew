import datetime
from backend.app.database import engine, Base, SessionLocal
from backend.app.models import (
    User, Role, Lead, FollowUp, Meeting, Quotation, SalesOrder,
    Product, StockTransaction, PurchaseOrder, GoodsReceivedNote,
    DeliveryChallan, MaterialIssue, Attendance, LeaveRequest,
    SalaryRecord, LoanRecord, AMCContract, ComplaintTicket,
    SpareRequisition, DayBookEntry, ExpenseVoucher, BillOfMaterials,
    ProductionOrder, UserActivity
)

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).count() > 0:
        db.close()
        return

    print("Seeding SalesNayak database with real-world data...")

    # 1. Users & Employees from the video
    employees = [
        ("Janabandhu Kampa", "janabandhu@salesnayak.com", "9876543210", "Super Admin", "Management", "Managing Director", 1200000.0),
        ("DEEPAK RANJAN SAHOO", "deepak@salesnayak.com", "9876543211", "Sales Executive", "Sales", "Sales Executive", 500000.0),
        ("G HEMRAJ RAO", "hemraj@salesnayak.com", "9876543212", "Warehouse Lead", "Warehouse", "Store Incharge", 300000.0),
        ("KOMAL PRIYA", "komal@salesnayak.com", "9876543213", "Sales Executive", "Sales", "Relationship Manager", 600000.0),
        ("PRITIMAYEE RANA", "pritimayee@salesnayak.com", "9876543214", "HR Manager", "HRM", "HR Lead", 400000.0),
        ("RASHMITA PRADHAN", "rashmita@salesnayak.com", "9876543215", "Accounts Officer", "Accounts", "Senior Accountant", 350000.0),
        ("Shankar Maharana", "shankar@salesnayak.com", "9876543216", "Senior Technician", "Service", "Field Technician", 250000.0),
        ("SIPU SETHI", "sipu@salesnayak.com", "9876543217", "Production Engineer", "Production", "QC & Assembly", 350000.0),
        ("SUBRAT KUMAR MOHAPATRA", "subrat@salesnayak.com", "9876543218", "Field Engineer", "Service", "Site Engineer", 300000.0),
        ("SUNIL KUMAR BAL", "sunil@salesnayak.com", "9876543219", "Project Coordinator", "Operations", "Project Lead", 400000.0)
    ]

    for name, email, mobile, role, dept, desig, target in employees:
        db.add(User(
            name=name,
            email=email,
            mobile=mobile,
            role_name=role,
            department=dept,
            designation=desig,
            status="Active",
            target_amount=target
        ))
    db.commit()

    # 2. Products from Video & Inventory Dashboard
    products = [
        ("PROD-SOLAR-001", "BALANGIR WARE HOUSE STOCK", "Finished Goods", "Pcs", 2500.0, 2100.0, 8167.0, 100.0, 10000.0, "Balangir Warehouse"),
        ("PROD-SOLAR-002", "SOLAR PANEL 540W MONO PERC", "Raw Material", "Pcs", 12500.0, 10800.0, 1671.0, 50.0, 3000.0, "Balangir Warehouse"),
        ("PROD-SOLAR-003", "SOLAR INVERTER 5KW ON-GRID", "Finished Goods", "Pcs", 38000.0, 32000.0, 306.0, 10.0, 500.0, "Balangir Warehouse"),
        ("PROD-SOLAR-004", "ACDB / DCDB PROTECTION BOX", "Finished Goods", "Set", 4500.0, 3800.0, 975.0, 20.0, 1500.0, "Balangir Warehouse"),
        ("PROD-SOLAR-005", "SOLAR MOUNTING STRUCTURE", "Raw Material", "Pcs", 6500.0, 5200.0, 2910.8, 50.0, 4000.0, "Balangir Warehouse"),
        ("PROD-SOLAR-006", "STRUCTURE NUT, BOLT & WASHER", "Consumables", "Box", 850.0, 650.0, 240.0, 50.0, 1000.0, "Balangir Warehouse"), # Fixed non-negative
        ("PROD-SOLAR-007", "ANCHOR BOLT M12x150MM", "Consumables", "Pcs", 45.0, 32.0, 490.0, 100.0, 2000.0, "Balangir Warehouse"),
        ("PROD-SOLAR-008", "EARTHING ROD COPPER BONDED", "Raw Material", "Pcs", 1200.0, 950.0, 150.0, 20.0, 500.0, "Balangir Warehouse"),
        ("PROD-SOLAR-009", "SOLAR DC CABLE 4 SQMM", "Raw Material", "Mtr", 48.0, 36.0, 25000.0, 500.0, 50000.0, "Balangir Warehouse")
    ]

    for code, name, cat, uom, uprice, cprice, stock, min_l, max_l, wh in products:
        p = Product(
            item_code=code,
            name=name,
            category=cat,
            uom=uom,
            unit_price=uprice,
            cost_price=cprice,
            current_stock=stock,
            min_level=min_l,
            max_level=max_l,
            warehouse=wh
        )
        db.add(p)
    db.commit()

    # 3. CRM Leads (mirroring 177 total leads from video)
    lead_sources = ["Reference"] * 78 + ["Calling"] * 6 + ["IndiaMart"] * 5
    lead_stages = ["New Lead"] * 88 + ["Success"] * 74 + ["Calling"] * 11 + ["Hold"] * 4
    
    sample_leads = [
        ("Naveen Patnaik", "Utkal Solar Agro", "9861000001", "naveen@utkalagro.in", "Reference", "Success", 4000.0),
        ("Debasis Mohanty", "Bhubaneswar Cold Storage", "9861000002", "debasis@bcs.com", "IndiaMart", "New Lead", 85000.0),
        ("Satyabrata Pradhan", "Cuttack Rice Mills", "9861000003", "satya@cuttackrice.com", "Calling", "Calling", 120000.0),
        ("Priyadarshini Dash", "Puri Beach Resort", "9861000004", "info@puriresort.com", "Reference", "Hold", 60000.0),
        ("Bijay Kumar Sahu", "Rourkela Steels Pvt Ltd", "9861000005", "bijay@rourkelasteel.com", "Reference", "New Lead", 250000.0),
        ("Anurag Mishra", "Sambalpur Textile Hub", "9861000006", "anurag@sthub.in", "Reference", "New Lead", 45000.0),
        ("Rashmi Rekha Jena", "Balasore Pharma Ltd", "9861000007", "rashmi@balasorepharma.com", "Calling", "New Lead", 180000.0),
        ("Gopal Krushna Behera", "Berhampur Auto Works", "9861000008", "gopal@berhampurauto.com", "IndiaMart", "New Lead", 95000.0)
    ]

    for idx, (name, comp, mob, em, src, stg, val) in enumerate(sample_leads, 1):
        db.add(Lead(
            lead_code=f"SN-LD-2026-{idx:03d}",
            name=name,
            company_name=comp,
            mobile=mob,
            email=em,
            source=src,
            stage=stg,
            assigned_user="Janabandhu Kampa",
            product_interest="5kW Solar Rooftop System",
            expected_value=val,
            notes="Customer interested in commercial net-metering setup"
        ))
    db.commit()

    # 4. Followups
    today = datetime.date.today()
    for i in range(1, 6):
        db.add(FollowUp(
            lead_id=i,
            lead_code=f"SN-LD-2026-{i:03d}",
            lead_name=sample_leads[i-1][0],
            user_name="Janabandhu Kampa",
            followup_type="WhatsApp" if i % 2 == 0 else "Call",
            followup_date=today,
            status="Scheduled",
            notes="Follow up regarding solar proposal and site survey schedule",
            next_date=today + datetime.timedelta(days=2)
        ))
    db.commit()

    # 5. Meetings (with fast query response, no timeout!)
    meetings_data = [
        ("Solar Feasibility Discussion", "Utkal Solar Agro", "Janabandhu Kampa", today, "11:00 AM", "Client Office", "Completed", "Proposal approved, awaiting advance."),
        ("DCR Documentation Review", "Bhubaneswar Cold Storage", "Janabandhu Kampa", today + datetime.timedelta(days=1), "02:30 PM", "Conference Hall", "Scheduled", "Review single line diagrams."),
        ("Commercial Rooftop Survey", "Cuttack Rice Mills", "Janabandhu Kampa", today + datetime.timedelta(days=3), "10:30 AM", "Site Visit", "Scheduled", "Inspect shadow-free area.")
    ]
    for title, client, user, mdate, mtime, loc, st, out in meetings_data:
        db.add(Meeting(
            title=title,
            client_name=client,
            user_name=user,
            meeting_date=mdate,
            meeting_time=mtime,
            location=loc,
            status=st,
            outcome=out
        ))
    db.commit()

    # 6. Quotation and Sales Order (Matching the 4,000 INR from video)
    q = Quotation(
        quote_no="QT-2026-001",
        customer_name="salesnayak",
        company_name="SalesNayak Enterprise",
        email="client@salesnayak.com",
        mobile="9861009999",
        quote_date=today,
        subtotal=3389.83,
        gst_rate=18.0,
        gst_amount=610.17,
        grand_total=4000.0,
        status="In Process",
        items_json='[{"item_code":"PROD-SOLAR-001","name":"BALANGIR WARE HOUSE STOCK","qty":1,"rate":3389.83,"gst_rate":18,"amount":4000.0}]'
    )
    db.add(q)
    db.commit()

    so = SalesOrder(
        order_no="SO-001",
        quote_no="QT-2026-001",
        customer_name="salesnayak",
        order_date=today,
        total_amount=4000.0,
        status="Running",
        delivery_date=today + datetime.timedelta(days=7)
    )
    db.add(so)
    db.commit()

    # 7. Production Order / Project Dashboard Item
    po_item = ProductionOrder(
        so_no="SO No 1",
        project_no="Project No 1",
        customer_name="salesnayak",
        contact_person="sumit",
        technician="Shankar Maharana",
        order_date=today,
        fy_year="2026-2027",
        order_value=4000.0,
        bom_cost=0.0,
        expense=0.0,
        direct_issue=0.0,
        actual_cost=0.0,
        balance=4000.0,
        status="Open Project",
        stage="Logistic/Warehouse",
        logistic_status="Bank Loan Process (Jansamarth Portal)",
        technician_status="Installation",
        dcr_status="DCR Generation & Form Generation",
        qc_status="Pending"
    )
    db.add(po_item)
    db.commit()

    # 8. HRM Attendance (Guaranteed strictly non-negative overtime!)
    for emp in employees:
        db.add(Attendance(
            user_name=emp[0],
            user_type="Company User",
            date=today,
            clock_in="09:30 AM",
            clock_out="06:30 PM",
            worked_hours=8.5,
            overtime_hours=0.5, # Strictly positive
            late_login=False,
            early_logout=False,
            status="Present"
        ))
    db.commit()

    # 9. Salary Records
    for emp in employees:
        db.add(SalaryRecord(
            employee_name=emp[0],
            user_type="Company User",
            month="September",
            year=2026,
            basic=25000.0,
            hra=10000.0,
            da=5000.0,
            conveyance=3000.0,
            special_allowance=2000.0,
            overtime_amount=1500.0,
            pf_deduction=1800.0,
            esi_deduction=500.0,
            loan_emi=0.0,
            net_salary=44200.0,
            status="Paid"
        ))
    db.commit()

    # 10. AMC Contract
    db.add(AMCContract(
        contract_no="AMC-2026-001",
        customer_name="salesnayak",
        customer_mobile="9861009999",
        customer_email="amc@salesnayak.com",
        asset_name="5kW Solar Rooftop Inverter & Array",
        contract_type="Periodic",
        start_date=today,
        end_date=today + datetime.timedelta(days=365),
        total_visits=4,
        completed_visits=1,
        total_amount=12000.0,
        status="Active"
    ))
    db.commit()

    # 11. Complaint Ticket (with OTP verification)
    db.add(ComplaintTicket(
        ticket_no="TK-1082",
        customer_name="Utkal Solar Agro",
        customer_mobile="9861000001",
        address="Plot 42, Infocity Road, Bhubaneswar",
        product_name="Solar Inverter 5kW On-Grid",
        issue_description="Inverter throwing Error code E02 (Grid Undervoltage) during peak sunlight hours.",
        service_type="Chargeable",
        priority="High",
        status="Open",
        assigned_technician="Shankar Maharana",
        otp_code="4829"
    ))
    db.commit()

    # 12. Day Book & Accounts
    db.add(DayBookEntry(
        entry_date=today,
        voucher_type="Receipt",
        account_name="HDFC Current Account",
        party_name="Utkal Solar Agro",
        debit=4000.0,
        credit=0.0,
        payment_mode="Bank",
        reference_no="NEFT/2026/89123",
        narration="Advance received against Solar Order SO-001"
    ))
    db.add(ExpenseVoucher(
        voucher_no="EXP-1001",
        category="Travel & Site Survey",
        amount=1200.0,
        paid_to="Shankar Maharana",
        expense_date=today,
        payment_mode="UPI",
        status="Approved",
        description="Fuel & site inspection allowance for Cuttack solar plant visit"
    ))
    db.commit()

    # 13. BOM (Bill of Materials)
    db.add(BillOfMaterials(
        bom_no="BOM-2026-001",
        product_name="5kW Solar Rooftop System Grid-Tie",
        bom_type="EBOM",
        status="Approved",
        components_json='[{"item": "Solar Panel 540W Mono PERC", "qty": 10, "uom": "Pcs"}, {"item": "Solar Inverter 5kW On-Grid", "qty": 1, "uom": "Pcs"}, {"item": "ACDB / DCDB Distribution Box", "qty": 1, "uom": "Set"}, {"item": "Structure Nut, Bolt & Washer", "qty": 40, "uom": "Box"}]'
    ))

    # 14. Purchase Orders & GRN
    db.add(PurchaseOrder(
        po_no="PO-2026-001",
        vendor_name="Tata Power Solar Systems Ltd",
        total_amount=125000.0,
        status="Approved",
        items_json='[{"item": "Solar Panel 540W Mono PERC", "qty": 50, "unit_price": 2500.0}]'
    ))
    db.add(GoodsReceivedNote(
        grn_no="GRN-2026-001",
        po_no="PO-2026-001",
        vendor_name="Tata Power Solar Systems Ltd",
        vehicle_no="OD-02-AZ-4512",
        gate_pass_no="GP-891",
        status="Accepted",
        items_json='[{"item": "Solar Panel 540W Mono PERC", "received_qty": 50, "accepted_qty": 50}]'
    ))

    # 15. Leave Requests
    db.add(LeaveRequest(
        user_name="DEEPAK RANJAN SAHOO",
        leave_type="Casual Leave",
        from_date=today,
        to_date=today,
        total_days=1,
        reason="Attending family function in Cuttack",
        status="Approved"
    ))
    db.commit()

    db.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_database()
