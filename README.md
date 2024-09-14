Example Version control
Master Branch {
    v1.0.0: "install library of api": {
                "body-parser": "^1.20.2",
                "cors": "^2.8.5",
                "csurf": "^1.11.0",
                "dotenv": "^16.4.5",
                "express": "^4.19.2",
                "express-fileupload": "^1.5.1",
                "express-rate-limit": "^7.4.0",
                "express-slow-down": "^2.0.3",
                "express-validator": "^7.1.0",
                "fs": "^0.0.1-security",
                "helmet": "^7.1.0",
                "jsonwebtoken": "^9.0.2",
                "morgan": "^1.10.0",
                "nodemailer": "^6.9.14",
                "nodemon": "^3.1.4",
                "pg": "^8.12.0",
                "sequelize": "^6.37.3"
            },
            "Create Model": {
                "ColorDetailModel": "Keep ColorCode of Sidebar, Navbar and Font in RequestDetail",
                C
            }
}

ModelAndFactory {
    v1.0.0: {   - Seeder ใช้ได้ทั้งหมดแล้ว
                - แก้ไขการเก็บ major โดยเก็บเป็น id และใช้คอลัมน์ shortName แทนในการเก็บพวก ENG01,...
                - แก้การเชื่อม profile ของ user ให้เชื่อมผ่าน id แทนชื่อรูปภาพแล้ว
                - tutoring hobby library เชื่อมไฟล์หรือรูปโดยใช้ id ของรูปใน ImageOrFileModel แทนชื่อแล้วเหมือนกัน
                - tutoring hobby library มีการ seeder สุ่ม faculty major department member request และรายละเอียดของกลุ่มหรือโพสต์ เรียบร้อยแล้ว
                สรุป
                    - seeder ได้หมดแล้ว
                    - HobbyModel/factory เรียบร้อย
                    - TutoringModel/factory เรียบร้อย
                    - LibraryModel/factory เรียบร้อย
                    - GroupModel เรียบร้อย
                    - DayModel เรียบร้อย
                    - GroupDayModel เรียบร้อย
                    - TagModel เรียบร้อย
                    - GroupTagModel เรียบร้อย
                    - MemberModel เรียบร้อย
                    - RequestModel เรียบร้อย"
            },
    v1.1.0: {    - แก้ seeder user ให้ seeder เป็น static โดยมี 6 user
                 - เพิ่ม seeder bookmark ให้กับ user
            }
}
