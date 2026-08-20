from django.test import TestCase

from .models import Visitor
from .serializers import VisitorSerializer


class LaptopRegistrationTests(TestCase):
    def test_laptop_registration_is_optional(self):
        serializer = VisitorSerializer(data={
            "name": "Jane Visitor", "purpose": "Meeting", "host": "Alex",
            "location": "Finance", "visitor_type": "Guest", "status": "Expected",
        })
        self.assertTrue(serializer.is_valid(), serializer.errors)
        visitor = serializer.save()
        self.assertFalse(visitor.has_laptop)

    def test_laptop_details_are_saved(self):
        serializer = VisitorSerializer(data={
            "name": "Jane Visitor", "purpose": "Meeting", "host": "Alex",
            "location": "Finance", "visitor_type": "Guest", "status": "Expected",
            "has_laptop": True, "laptop_make_model": "Dell Latitude",
            "laptop_serial_number": "ABC-123",
        })
        self.assertTrue(serializer.is_valid(), serializer.errors)
        visitor = serializer.save()
        self.assertTrue(visitor.has_laptop)
        self.assertEqual(visitor.laptop_serial_number, "ABC-123")

# Create your tests here.
