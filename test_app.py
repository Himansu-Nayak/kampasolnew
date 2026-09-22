import os
import sys
import unittest
from fastapi.testclient import TestClient

# Ensure root is on path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from backend.app.main import app
from backend.app.seed import seed_database

class TestSalesNayakSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        seed_database()
        cls.client = TestClient(app)

    def test_01_health_and_index(self):
        res = self.client.get("/health")
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json()["status"], "healthy")

        res_home = self.client.get("/")
        self.assertEqual(res_home.status_code, 200)
        self.assertIn("SALES NAYAK", res_home.text)

    def test_02_meeting_dashboard_no_timeout(self):
        # In legacy ASP.NET app (sec 0150), this crashed with SqlException: Execution Timeout Expired
        res = self.client.get("/api/dashboard/meeting")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("error_free"))
        self.assertGreaterEqual(len(data.get("meetings_list", [])), 1)

    def test_03_inventory_non_negative_stock(self):
        # In legacy app (sec 0255), stock showed negative numbers like -2.00, -56.00
        res = self.client.get("/api/dashboard/inventory")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        for p in data["products"]:
            self.assertGreaterEqual(p["current_stock"], 0.0, f"Negative stock detected on {p['name']}!")

    def test_04_material_issue_prevents_negative_stock(self):
        # Attempting to issue more stock than available must be rejected with 400
        payload = {
            "project_id": "Project No 1",
            "issued_to": "Shankar Maharana",
            "issue_type": "Non-Returnable",
            "product_id": 1,
            "quantity": 999999.0 # Way above available 8,167
        }
        res = self.client.post("/api/erp/material-issues", json=payload)
        self.assertEqual(res.status_code, 400)
        self.assertIn("Insufficient stock", res.json()["detail"])

    def test_05_hrm_positive_overtime(self):
        # In legacy app (sec 0330), overtime was showing negative numbers like -0.53, -0.02
        res = self.client.get("/api/dashboard/hrm")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        for a in data["attendance_list"]:
            self.assertGreaterEqual(a["overtime_hours"], 0.0, f"Negative overtime on {a['employee_name']}!")

    def test_06_complaint_otp_closure(self):
        # Testing OTP closure flow
        # 1. Fetch tickets
        res = self.client.get("/api/complaints/tickets")
        self.assertEqual(res.status_code, 200)
        tickets = res.json()
        self.assertTrue(len(tickets) > 0)
        t = tickets[0]
        
        # 2. Test invalid OTP rejection
        res_fail = self.client.post("/api/complaints/tickets/verify-otp-close", json={
            "ticket_no": t["ticket_no"],
            "otp_code": "0000"
        })
        self.assertEqual(res_fail.status_code, 400)

        # 3. Test valid OTP acceptance
        res_pass = self.client.post("/api/complaints/tickets/verify-otp-close", json={
            "ticket_no": t["ticket_no"],
            "otp_code": t["otp_code"],
            "resolution_notes": "Grid voltage issue resolved."
        })
        self.assertEqual(res_pass.status_code, 200)
        self.assertIn("verified via OTP", res_pass.json()["message"])

    def test_07_production_project_actions(self):
        res = self.client.get("/api/production/orders")
        self.assertEqual(res.status_code, 200)
        orders = res.json()
        self.assertTrue(len(orders) > 0)
        order_id = orders[0]["id"]

        # Trigger QC pass action
        res_act = self.client.put(f"/api/production/orders/{order_id}/action?action=qc_pass")
        self.assertEqual(res_act.status_code, 200)

if __name__ == "__main__":
    unittest.main(verbosity=2)
