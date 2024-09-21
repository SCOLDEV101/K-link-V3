ModelAndFactory { v1.0.0: { - Seeder ใช้ได้ทั้งหมดแล้ว 
                            - แก้ไขการเก็บ major โดยเก็บเป็น id และใช้คอลัมน์ shortName แทนในการเก็บพวก ENG01,... 
                            - แก้การเชื่อม profile ของ user ให้เชื่อมผ่าน id แทนชื่อรูปภาพแล้ว 
                            - tutoring hobby library เชื่อมไฟล์หรือรูปโดยใช้ id ของรูปใน ImageOrFileModel แทนชื่อแล้วเหมือนกัน 
                            - tutoring hobby library มีการ seeder สุ่ม faculty major department member request และรายละเอียดของกลุ่มหรือโพสต์ เรียบร้อยแล้ว 
                            
                            สรุป - seeder ได้หมดแล้ว 
                                - HobbyModel/factory เรียบร้อย 
                                - TutoringModel/factory เรียบร้อย 
                                - LibraryModel/factory เรียบร้อย 
                                - GroupModel เรียบร้อย 
                                - DayModel เรียบร้อย 
                                - GroupDayModel เรียบร้อย 
                                - TagModel เรียบร้อย 
                                - GroupTagModel เรียบร้อย 
                                - MemberModel เรียบร้อย - RequestModel เรียบร้อย" 
                }, 
                v1.1.0: {   - แก้ seeder user ให้ seeder เป็น static โดยมี 6 user 
                            - เพิ่ม seeder bookmark ให้กับ user 
                }, 
                V1.2.0: {   - แก้ไข authcontroller ให้ใช้ key uID เป็น id 
                            - แก้ไขให้ showAboutUser ใน UserController เปลี่ยน key uID เป็น id 
                            - แก้ updateAboutUser ใน UserController เปลี่ยน key uID เป็น id และ วิธีเปลี่ยนการเซฟ file path ไปที่ imageOrFile_model 
                            - แก้ UserResource เปลี่ยน key facultyID , majorID , เพิ่ม imageOrFile เพื่อดึง path รูปโปรไฟล์ 
                            - แก้ UserModel validation ให้สามารถ ตรวจสอบได้ดีขึ้น (จำกัดตัวอักษรที่ใช้ได้, จำกัดจำนวนตัวอักษรที่พิมพ์, ละเว้นข้อมูลที่ไม่ได้ส่งมา update) 
                            - แก้ TutoringModel เพิ่มฟังก์ชั่น leaderGroup เพื่อให้สามารถดึง รหัสหัวหน้ากลุ่มมาใช้ได้ 
                            - แก้ LibraryModel เพิ่มฟังก์ชั่น leaderGroup เพื่อให้สามารถดึง รหัสหัวหน้ากลุ่มมาใช้ได้ 
                            - แก้ memberInfo ใน UserController เปลี่ยน key uID เป็น id 
                            - แก้ report ใน UserController เปลี่ยน key uID เป็น id และ hID เป็น groupID และเปลี่ยนวิธีการดึงรหัสหัวหน้ากลุ่ม leaderGroup 
                            - แก้ ReportedModel แก้ validation ตัว detail เพิ่มการจำกัดตัวอักษรที่ให้ผ่านไปเก็บใน db และ เพิ่มการจำกัดตัวอักษร + $fillable
                },
                v1.3.0: {   - แก้ type ใน migration โดยเก็บ groupID เป็น integer แทน string
                            - แก้ factory, เก็บ id จาก groupModel แทน ตอนแรกเป็น id จาก hobby,tutoring,library
                },
                v1.3.1: {   - relation ของ groupModel (ไม่สมบูรณ์)
                },
                v1.3.2: {   - ฟังก์ชันส่วนใหญ่ใน Hobby
                                - showAllGroup แสดงกลุ่ม HobbyHome *done
                                - createGroup *done
                                - update มี noti *done 
                                - memberGroup ดูสมาชิก *done
                                - aboutGroup ดูภายในกลุ่ม *done
                                - checkRequestGroup ดูคนขอเข้ากลุ่ม *done
                                - rejectOrAcceptRequest รับหรือปฏิเสธคนขอเข้ากลุ่ม *inprogress
                                - kickMember เตะสมาชิก มี noti *done
                                - deleteGroup มี noti *done
                            - resource รวมของ Hobby, Library, Tutoring ชื่อว่า GroupResource
                            - เชื่อม relation ใน model
                }
}