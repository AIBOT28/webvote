Thiết kế hệ thống đánh giá giảng viên
Công nghệ:
    Frontend: Next.js - trong folder frontend
    Backend: Node.js - trong folder backend
    Database: MongoDB

Yêu cầu:
    1. Quản lý tài khoản
        - Role: ADMIN (Quản lý toàn bộ website), Quản trị viên (Quản lý các giáo viên đánh giá), Student
        - Đăng nhập: Email, Password, Google Sign In
        - Đăng ký: Chỉ Student có thể đăng ký, Admin được cấp tài khoản từ đầu, Quản trị viên được phân quyền bởi Admin
        - Mỗi Role có các quyền hạn khác nhau
    2. Quản lý khoa
        - ADMIN có thể thêm, sửa, xóa khoa
        - Quản trị viên có thể thêm, sửa, xóa khoa
        - Student không thể thêm, sửa, xóa khoa
    3. Quản lý môn học
        - ADMIN có thể thêm, sửa, xóa môn học
        - Quản trị viên có thể thêm, sửa, xóa môn học
        - Student không thể thêm, sửa, xóa môn học
    4. Quản lý giảng viên
        - ADMIN có thể thêm, sửa, xóa giảng viên
        - Quản trị viên có thể thêm, sửa, xóa giảng viên
        - Student không thể thêm, sửa, xóa giảng viên
    5. Quản lý đánh giá
        - ADMIN có thể thêm, sửa, xóa đánh giá
        - Quản trị viên có thể thêm, sửa, xóa đánh giá
        - Student có thể thêm, sửa, xóa đánh giá
        - Mỗi đánh giá từ 1 - 5 sao. Lấy ra số sao trung bình của từng môn học, hiển thị số sao và tổng số lượt đánh giá
    6. Quản lý thống kê
        - ADMIN có thể xem thống kê
        - Quản trị viên có thể xem thống kê
        - Student có thể xem thống kê  
    7. UI/UX
        - Giao diện hiện đại, đẹp, dễ sử dụng
        - Giao diện responsive, mobile-first
        - Giao diện có các tính tăng xếp hạng giảng viên toàn trường, theo khoa.
        - Giao diện có các tính năng tìm kiếm, lọc, sắp xếp, phân trang
        - Có giao diện dashboard cho ADMIN và Quản trị viên

update version 1:
    - Giảng viên: bỏ email, số điện thoại, tiểu sự
    - Đánh giá: không đánh giá theo môn học mà đánh gia chung luôn.
    - Chỉ cho phép đăng ký bằng tài khoản google.