import api from "./api.js";

/* =========================================
   NORMALIZE VISITOR
   Converts Django snake_case → frontend camelCase
========================================= */
function normalizeVisitor(visitor) {
    return {
        id: visitor.id,
        name: visitor.name,
        company: visitor.company,
        phone: visitor.phone,
        nationalId: visitor.national_id,
        hasLaptop: visitor.has_laptop,
        laptopMakeModel: visitor.laptop_make_model,
        laptopSerialNumber: visitor.laptop_serial_number,
        host: visitor.host,
        purpose: visitor.purpose,
        visitorType: visitor.visitor_type,
        department: visitor.location,
        location: visitor.location,
        organizationId: visitor.organization,
        organizationName: visitor.organization_name,
        expectedTime: visitor.expected_time,
        status: visitor.status,
        createdAt: visitor.created_at,
        updatedAt: visitor.updated_at
    };
}

/* =========================================
   GET ALL VISITORS
========================================= */
export async function getVisitors() {
    const response =
        await api.get("/visitors/");
    return response.data.map(
        normalizeVisitor
    );
}

/* =========================================
   GET SINGLE VISITOR
========================================= */
export async function getVisitor(id) {
    const response =
        await api.get(
            `/visitors/${id}/`
        );
    return normalizeVisitor(
        response.data
    );
}

/* =========================================
   ADD VISITOR
========================================= */
export async function addVisitor(visitor) {
    const response =
        await api.post(
            "/visitors/",
            {
                name: visitor.name,
                company: visitor.company,
                phone: visitor.phone,
                national_id:
                    visitor.nationalId,
                has_laptop: visitor.hasLaptop,
                laptop_make_model: visitor.laptopMakeModel,
                laptop_serial_number: visitor.laptopSerialNumber,
                host: visitor.host,
                location: visitor.department,
                purpose: visitor.purpose,
                visitor_type:
                    visitor.visitorType,
                expected_time:
                    visitor.expectedTime,
                status:
                    visitor.status
            }
        );
    return normalizeVisitor(
        response.data
    );
}

/* =========================================
   UPDATE VISITOR
========================================= */
export async function updateVisitor(
    id,
    visitor
) {
    const response =
        await api.put(
            `/visitors/${id}/`,
            {
                name: visitor.name,
                company: visitor.company,
                phone: visitor.phone,
                national_id:
                    visitor.nationalId,
                has_laptop: visitor.hasLaptop,
                laptop_make_model: visitor.laptopMakeModel,
                laptop_serial_number: visitor.laptopSerialNumber,
                host: visitor.host,
                location: visitor.department,
                purpose: visitor.purpose,
                visitor_type:
                    visitor.visitorType,
                expected_time:
                    visitor.expectedTime,
                status:
                    visitor.status
            }
        );
    return normalizeVisitor(
        response.data
    );
}

/* =========================================
   DELETE VISITOR
========================================= */
export async function deleteVisitor(id) {
    await api.delete(
        `/visitors/${id}/`
    );
    return true;
}
