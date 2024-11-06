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
                },
                 v1.3.3: {   - UserController
                                - viewBookmark ดู bookmark *done,check
                                - addOrDeleteBookmark เพิ่ม-ลบ bookmark *done,check
                                - report รายงาน มี noti *done,check 
                                - memberInfo ดูข้อมูลโปรไฟล์สมาชิก *done,check
                                - showAboutUser ดูข้อมูลโปรไฟล์ตัวเอง *done,check
                                - updateAboutUser แก้ไขข้อมูลโปรไฟล์ตัวเอง *done,check
                                - invitePage หน้าสำหรับเชิญเพื่อนของกลุ่มนั้นๆ มี noti *done,check
                                - inviteFriend ชวนเพื่อน มี noti *done,check
                                - requestToGroup มี noti *done,check
                                - notification ดูการแจ้งเตือนโดยผู้รับเป็นเรา *done,check
                                - myPost ดูโพสต์ที่เกี่ยวข้อง *done,check
                                - leaveGroup ออกกลุ่มที่อยู่(ต้องไม่เป็น leader) *done,check
                            - resource 
                                - GroupResource ลบส่วนที่ไม่ได้ใช้
                                - MyPostResource *done
                                - NotificationResource *done
                            - model
                                - BookmarkModel เพิ่ม relation และ fillable groupID,userID
                                - NotifyModel เพิ่ม relation
                },
                v1.3.4: {   - HobbyController
                                - แก้ deleteGroup
                            - TutoringController
                                - แก้ deleteGroup
                            - LibraryController
                                - แก้ createGroup,updateGroup,deleteGroup
                            - resource 
                                - GroupResource แก้ส่วน hobby
                            - job
                                - แก้ไขโค้ดแปลง pdf to image
                            - model
                                - librarymodel แก้การ validate
                            - api
                                - แก้ไขชื่อ route และชื่อฟังก์ชั่นของ Library
                                - แก้ไขชื่อ route และชื่อฟังก์ชั่นของ Tutoring
                                - แก้ไขชื่อ route และชื่อฟังก์ชั่นของ Hobby
                                - เปลี่ยน createGroup , updateGroup , deleteGroup
                },
                v1.3.5: {
                            - HobbyModel
                                - แก้ validate
                                    'image'=> ['sometimes','mimes:png,jpg,jpeg,gif'],
                                    'deleteimage'=> ['sometimes','nullable'],
                                    'memberMax' => ['nullable', 'regex:/\b([0-9]|[1-9][0-9])\b/'],
                                - แก้ id generate
                                    $lastGroup = GroupModel::where([['type', "hobby"], ['groupID', 'LIKE', $prefix . '%']])->orderBy('groupID', 'desc')->first();
                            - LibraryModel
                                - แก้ id generate
                                    $lastGroup = GroupModel::where([['type', "library"], ['groupID', 'LIKE', $prefix . '%']])->orderBy('groupID', 'desc')->first();
                            - TutoringModel
                                -แก้ validate
                                    'startTime' => ['required','regex:/^[0-9:]+$/u'],
                                    'endTime' => ['required','regex:/^[0-9:]+$/u'],
                                    'image'=> ['sometimes','mimes:png,jpg,jpeg,gif'],
                                    'deleteimage'=> ['sometimes','nullable'],
                                    'activityName' => ['required', 'regex:/^[a-zA-Z0-9ก-๙\s]+$/u'],
                                    'memberMax' => ['nullable', 'regex:/\b([0-9]|[1-9][0-9])\b/'],
                                - แก้ id generate
                                    $lastGroup = GroupModel::where([['type', "tutoring"], ['groupID', 'LIKE', $prefix . '%']])->orderBy('groupID', 'desc')->first();
                            - UserModel
                                -เพิ่ม hasOne imageOrFile
                                -แก้ validate
                                    'image'=> ['sometimes','mimes:png,jpg,jpeg,gif']
                            - HobbyController
                                - แก้ createGroup
                                - แก้ updateGroup
                            - TutoringController
                                - แก้ createGroup
                                - แก้ updateGroup
                            - LibraryController
                                - แก้ createGroup,updateGroup
                            - migrate
                                - ลบ section ออก
                                - แก้ tutoring
                                    imageOrFileID -> nullable
                            - api
                                - แก้ชื่อ route hobby/member/ -> hobby/memberGroup/
                                - แก้ชื่อ route user/updateMyAccount -> user/updateAccount
                                - แก้ชื่อ route library/sharedlibrary -> library/shared
                                - แก้ชื่อ route library/downloadedlibrary -> library/downloaded
                                - แก้ชื่อ route tutoring/member/ -> tutoring/memberGroup/
            },
            v1.3.6: {
                        - 1.HobbyController
                            1.1.แก้ rejectOrAcceptRequest รับ / ไม่รับ คำขอเข้ากลุ่ม
                            1.2.แก้ kickMember เตะสมาชิกออก
                            1.3.แก้ changeLeader เปลี่ยนหัวหน้ากลุ่ม
                            1.4.แก้ requestMember ดูคำขอทั้งหมด
                            1.5.แก้ updateGroup ให้ update เวลา group ด้วย
                            1.6.เปลี่ยนตัวแปร $hID เป็น groupID ทั้งหมด
                        - 2.TutoringController
                            2.1.แก้ rejectOrAcceptRequest รับ / ไม่รับ คำขอเข้ากลุ่ม
                            2.2.แก้ kickMember เตะสมาชิกออก
                            2.3.แก้ changeLeader เปลี่ยนหัวหน้ากลุ่ม
                            2.4.แก้ requestMember ดูคำขอทั้งหมด
                            2.5.แก้ updateGroup ให้ update เวลา group ด้วย
                            2.6.เปลี่ยนตัวแปร $tID เป็น groupID ทั้งหมด
                        - 3.LibraryController
                            3.1.แก้ updateGroup ให้ update เวลา group ด้วย
                            3.2.เปลี่ยนตัวแปร $lID เป็น groupID ทั้งหมด
                        - 4.UserController
                            4.1.แก้ addOrDeleteBookmark เพิ่ม / ลบ บุ๊คมาร์ค
                            4.2.แก้ invitePage เชิญเพื่อน
                            4.3.แก้ requestToGroup สร้างคำขอเข้ากลุ่ม
                            4.4.แก้ notification เรียกดู notify
                            4.5.แก้ leaveGroup
                        - 5.SearchController
                            5.1.แก้ searchGroup ให้ใช้ได้ทั้งในกรณี ที่มี $type และ $keyword
                            5.2.แก้ searchInvite ให้ใช้สามารถงานได้
                        - 6.LeaderCheck 
                            6.1.แก้ การรับชื่อตัวแปรจาก params
                            6.2.แก้การส่ง message error
                        - 7.GroupResource 
                            7.1.แก้โค้ดที่เช็ค memberMax และ userstatus
                        - 8.GroupModel
                            8.1.เพิ่ม searchValidators กรองคำที่ใช้ได้ใน keyword
                        - 9.HobbyModel
                            9.1.ลบ searchHobby() ออก ไปใส่ใน SearchController -> searchGroup
                        - 10.RequestModel
                            10.1.เพิ่ม validator กรอง method และ userID ที่จะใช้ใน rejectOrAcceptRequest หรือ ตอบคำขอเข้าร่วมกลุ่ม
                        - 11.UserModel
                            11.1.ลบ searchInvite() ออก ไปใส่ใน SearchController -> searchInvite
                            11.2.แก้ faculty , major relation
                        - 12.api
                            - แก้พวก $hID , $tID , $lID เป็น $groupID 
                            12.1.แก้ชื่อ route /searching/search/{type?} -> /search/{type?}
                            12.2.แก้ชื่อ route /searching/searchInvite/{hID} -> /searchInvite/{groupID}
                            12.3.แก้ชื่อ route addOrDeleteBookmark/{id} -> addOrDeleteBookmark/{groupID}
                            12.4.แก้ชื่อ route invitePage/{id} -> invitePage/{groupID}
                            12.5.แก้ชื่อ route inviteFriend/{hID} -> inviteFriend/{groupID}
                            12.6.แก้ชื่อ route leaveGroup/{hID} -> leaveGroup/{groupID} และเปลี่ยน method จาก delete เป็น post
            },
            v1.4.0: {
                    - api : {
                        เพิ่ม route
                            - localhost:8000/api/searchTag สำหรับการ suggestion Tag ที่มีค้นใช้มากที่สุด 
                                ต้องส่ง input('type') มาด้วย เป็นพวก hobby, library, tutoring
                                แล้วจะส่ง array message[] ออกมาให้
                            - localhost:8000/api/tag สำหรับแนะนำ tag ตอนสร้างกลุ่ม
                                ต้องส่ง input('type') มาด้วย สามารถส่งพวก
                                input('activityName') input('startTime') input('location') มาได้
                    },
                    - model : {
                        - GroupTagModel : สร้าง relation ไปหา tag
                    },
                    - factory : {
                        - HobbyModelFactory : แก้ไข static พวก activityNames, locations, tags ใหม่
                    },
                    - controller : {
                        - SearchController : เพิ่ม function สำหรับการ searchTag และ tag แนะนำตอนสร้างกลุ่ม
                    },
            },
}
