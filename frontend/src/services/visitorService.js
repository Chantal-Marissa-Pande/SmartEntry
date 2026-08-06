let visitors = [
    {
        id: 1,
        name: "John Doe",
        company: "Eclectics",
        phone: "0712345678",
        nationalId: "12345678",
        host: "Jane Mwangi",
        purpose: "Meeting",
        visitorType: "Guest",
        expectedTime: "2026-08-06T09:30",
        status: "Checked In"
    },
    {
        id: 2,
        name: "Jane Smith",
        company: "Microsoft",
        phone: "0798765432",
        nationalId: "87654321",
        host: "Peter Kimani",
        purpose: "Delivery",
        visitorType: "Vendor",
        expectedTime: "2026-08-06T10:30",
        status: "Expected"
    }
];

export function getVisitors() {
    return visitors;
}

export function getVisitor(id) {
    return visitors.find(visitor => visitor.id === id);
}

export function addVisitor(visitor) {
    visitors.unshift(visitor);
}

export function updateVisitor(updatedVisitor) {
    visitors = visitors.map(visitor =>
        visitor.id === updatedVisitor.id ? updatedVisitor : visitor
    );
}

export function deleteVisitor(id) {
    visitors = visitors.filter(visitor => visitor.id !== id);
}