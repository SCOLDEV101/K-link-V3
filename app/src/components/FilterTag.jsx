import React, { useState } from "react";

export function FilterTag({
  selectedCategoryNames,
  toggleCategoryName,
  categories,
}) {
  return (
    <div className="d-flex flex-row gap-2 flex-nowrap overflow-auto px-2 py-2" style={{boxShadow: "0px 5px 10px rgba(0, 0, 0, .25)", borderBottomRightRadius:"15px", borderBottomLeftRadius:"15px"}}> 
    <div className="d-flex flex-row gap-2 flex-nowrap overflow-auto" style={{borderRadius:"15px"}}>    
    {categories &&
        categories.map((category) => (
          <a
            key={category.name}
            type="button"
            onClick={() =>
              toggleCategoryName(
                category.name.toLowerCase(),
                category.checkVariable 
              )
            }
            className="btn d-flex flex-row justify-content-center align-items-center gap-2 ps-2 rounded-pill text-nowrap"
            style={{ background: "#D9D9D9"}}
          >
            <div
              className="rounded-circle m-0"
              style={{
                width: "22px",
                height: "22px",
                background: selectedCategoryNames.includes(
                  category.name.toLowerCase()
                )
                  ? "#FFB600"
                  : "#FFFF",
              }}
            ></div>
            <span>{category.name}</span>
          </a>
        ))}
        </div>
       </div>
  );
}

// EXAMPLES TO USE
function FilterTagList() {
  // ======================================================[ !mportant ]===============================================
  const [selectedCategoryNames, setSelectedCategoryNames] = useState([]);
  const [selectedCategoryVariables, setSelectedCategoryVariables] = useState(
    []
  );
  const categories = [
    { name: "Hobby", checkVariable: "isHobby" },
    { name: "Library", checkVariable: "isLibrary" },
    { name: "Tutoring", checkVariable: "isTutoring" },
    { name: "กลุ่มที่เข้าร่วมแล้ว", checkVariable: "isMember" },
    { name: "กลุ่มที่รอการตอบรับ", checkVariable: "isRequest" },
    { name: "โพสต์ของฉัน", checkVariable: "isCreator" },
  ];
  // ======================================================[ !mportant ]===============================================

  const Lists = [
    {
      hID: "h-20240803-025",
      type: "hobby",
      image: null,
      tag: "การสัมมนา",
      member: 40,
      memberMax: 66,
      activityName: "การจัดการโครงการวิจัย",
      leader: "IoT-950",
      teachBy: "IoT-950",
      weekDate: "พฤ.,ศ.,ส.,อา.",
      actTime: "17:17:46",
      location: "ศูนย์การค้าสยามพารากอน",
      detail: "ข้อมูลการลงทะเบียน",
      userstatus: "member",
      tutoringFaculty: null,
      tutoringMajor: null,
      date: null,
      Starttime: null,
      Endtime: null,
      libraryImage: null,
      libraryFaculty: null,
      FilterTag: {
        isMember: true,
        isRequest: false,
        isLeader: true,
        isCreator: true,
        isLibrary: false,
        isHobby: true,
        isTutoring: false,
      },
      bookmark: null,
    },
    {
      hID: "h-20240803-027",
      type: "hobby",
      image: null,
      tag: "การประชุมภายในองค์กร,การเรียนรู้ตลอดชีวิต,การตลาดและการประชาสัมพันธ์,งานเสวนา",
      member: 36,
      memberMax: null,
      activityName: "งานประชุมด้านการศึกษา",
      leader: "IoT-513",
      teachBy: "IoT-513",
      weekDate: "จ.,อ.,พ.,พฤ.,ศ.,ส.,อา.",
      actTime: "15:37:21",
      location: "รามคำแหง",
      detail: "ข้อมูลการลงทะเบียน",
      userstatus: "member",
      tutoringFaculty: null,
      tutoringMajor: null,
      date: null,
      Starttime: null,
      Endtime: null,
      libraryImage: null,
      libraryFaculty: null,
      FilterTag: {
        isMember: true,
        isRequest: false,
        isLeader: false,
        isCreator: false,
        isLibrary: false,
        isHobby: true,
        isTutoring: false,
      },
      bookmark: null,
    },
    {
      hID: "h-20240803-041",
      type: "tutoring",
      image: null,
      tag: "โครงการนวัตกรรม,การสัมมนา,การอบรมเทคโนโลยี,การศึกษาเชิงวิจัย,การฝึกอบรมระดับชาติ",
      member: 15,
      memberMax: 23,
      activityName: "การแข่งขันวิชาการ",
      leader: "IoT-491",
      teachBy: "IoT-491",
      weekDate: "ส.,อา.",
      actTime: "02:19:10",
      location: "ปทุมธานี",
      detail: "รายละเอียดกิจกรรมการศึกษาต่อ",
      userstatus: "member",
      tutoringFaculty: "แพทยศาสตร์",
      tutoringMajor: "วิศวกรรมชีวการแพทย์ & แพทยศาสตรบัณฑิต",
      date: "1976-06-12",
      Starttime: "15:00:15",
      Endtime: "20:20:58",
      libraryImage: null,
      libraryFaculty: null,
      FilterTag: {
        isMember: false,
        isRequest: true,
        isLeader: false,
        isCreator: false,
        isLibrary: false,
        isHobby: false,
        isTutoring: true,
      },
      bookmark: null,
    },
    {
      hID: "h-20240803-072",
      type: "hobby",
      image: null,
      tag: "งานเชื่อมโยงวิจัย",
      member: 45,
      memberMax: 53,
      activityName: "การศึกษาเชิงปฏิบัติ1",
      leader: "IoT-194",
      teachBy: "IoT-194",
      weekDate: "ส.,อา.",
      actTime: "01:11:08",
      location: "หอประชุมสมเด็จพระเทพฯ",
      detail: "ข้อมูลเพิ่มเติมเกี่ยวกับการประชุม",
      userstatus: "member",
      tutoringFaculty: null,
      tutoringMajor: null,
      date: null,
      Starttime: null,
      Endtime: null,
      libraryImage: null,
      libraryFaculty: null,
      FilterTag: {
        isMember: true,
        isRequest: false,
        isLeader: false,
        isCreator: false,
        isLibrary: false,
        isHobby: true,
        isTutoring: false,
      },
      bookmark: null,
    },
    {
      hID: "h-20240803-075",
      type: "tutoring",
      image: null,
      tag: "กิจกรรมวิทยาศาสตร์,การเรียนรู้ตลอดชีวิต,การจัดการความรู้,การจัดการข้อมูล,การฝึกอบรมระดับชาติ",
      member: 51,
      memberMax: null,
      activityName: "การศึกษาเชิงปฏิบัติ2",
      leader: "IoT-311",
      teachBy: "IoT-311",
      weekDate: "อา.",
      actTime: "11:36:02",
      location: "ม.สุรนารี",
      detail: "คำแนะนำในการเตรียมเอกสาร",
      userstatus: "member",
      tutoringFaculty: "วิทยาลัยอุตสาหกรรมการบินนานาชาติ",
      tutoringMajor: null,
      date: "1998-08-11",
      Starttime: "12:03:40",
      Endtime: "21:53:31",
      libraryImage: null,
      libraryFaculty: null,
      FilterTag: {
        isMember: true,
        isRequest: false,
        isLeader: false,
        isCreator: false,
        isLibrary: false,
        isHobby: false,
        isTutoring: true,
      },
      bookmark: null,
    },
    {
      hID: "h-20240803-101",
      type: "tutoring",
      image: null,
      tag: "tag1,tag2",
      member: 1,
      memberMax: 10,
      activityName: "test-556677881",
      leader: "IoT-638",
      teachBy: "IoT-638",
      weekDate: "-",
      actTime: "00:00:00",
      location: "test-10 location",
      detail: "test-10 detail",
      userstatus: "member",
      tutoringFaculty: "วิศวกรรมศาสตร์",
      tutoringMajor: null,
      date: "2024-12-10",
      Starttime: "17:35:00",
      Endtime: "17:35:00",
      libraryImage: null,
      libraryFaculty: null,
      FilterTag: {
        isMember: true,
        isRequest: false,
        isLeader: true,
        isCreator: true,
        isLibrary: false,
        isHobby: false,
        isTutoring: true,
      },
      bookmark: null,
    },
    {
      hID: "h-20240803-102",
      type: "tutoring",
      image: null,
      tag: "tag1,tag2",
      member: 1,
      memberMax: 10,
      activityName: "test-556677882",
      leader: "IoT-638",
      teachBy: "IoT-638",
      weekDate: "-",
      actTime: "00:00:00",
      location: "test-10 location",
      detail: "test-10 detail",
      userstatus: "member",
      tutoringFaculty: "วิศวกรรมศาสตร์",
      tutoringMajor: null,
      date: "2024-12-10",
      Starttime: "17:35:00",
      Endtime: "17:35:00",
      libraryImage: null,
      libraryFaculty: null,
      FilterTag: {
        isMember: true,
        isRequest: false,
        isLeader: true,
        isCreator: true,
        isLibrary: false,
        isHobby: false,
        isTutoring: true,
      },
      bookmark: null,
    },
    {
      hID: "h-20240803-103",
      type: "tutoring",
      image: null,
      tag: "tag1,tag2",
      member: 1,
      memberMax: 10,
      activityName: "test-556677883",
      leader: "IoT-638",
      teachBy: "IoT-638",
      weekDate: "-",
      actTime: "00:00:00",
      location: "test-10 location",
      detail: "test-10 detail",
      userstatus: "member",
      tutoringFaculty: "วิศวกรรมศาสตร์",
      tutoringMajor: null,
      date: "2024-12-10",
      Starttime: "17:35:00",
      Endtime: "17:35:00",
      libraryImage: null,
      libraryFaculty: null,
      FilterTag: {
        isMember: true,
        isRequest: false,
        isLeader: true,
        isCreator: true,
        isLibrary: true,
        isHobby: false,
        isTutoring: false,
      },
      bookmark: null,
    },
  ];

  // ======================================================[ !mportant ]===============================================
  const toggleCategoryName = (name, variableCheck) => {
    setSelectedCategoryNames((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((categoryName) => categoryName !== name)
        : [...prevSelected, name]
    );
    setSelectedCategoryVariables((prevSelected) =>
      prevSelected.includes(variableCheck)
        ? prevSelected.filter(
            (checkVariable) => checkVariable !== variableCheck
          )
        : [...prevSelected, variableCheck]
    );
    console.log("log[" + selectedCategoryNames + "]");
    console.log("log[" + selectedCategoryVariables + "]");
  };

  const filteredLists = selectedCategoryVariables.length
    ? Lists.filter((list) =>
        selectedCategoryVariables.some((category) => list.FilterTag[category])
      )
    : Lists;
  // ======================================================[ !mportant ]===============================================

  return (
    <div>
      {/* =====================================[ FilterTag ]===================================== */}
      <FilterTag
        selectedCategoryNames={selectedCategoryNames}
        toggleCategoryName={toggleCategoryName}
        categories={categories}
      />

      {/* =====================================[ List form filter ]===================================== */}
      <div className="">
        {filteredLists.map((list) => (
          <div key={list.hID}>{list.activityName}</div>
        ))}
      </div>
    </div>
  );
}

export default FilterTagList;


// export function FilterTag({
//   selectedCategoryNames,
//   toggleCategoryName,
//   categories,
// }) {
//   return (
//     <div className="d-flex flex-row gap-2 flex-nowrap overflow-auto p-3">
//       {categories &&
//         categories.map((category) => (
//           <a
//             key={category.name}
//             type="button"
//             onClick={() => toggleCategoryName(category.name.toLowerCase())}
//             className="btn d-flex flex-row justify-content-center align-items-center gap-2 ps-2 rounded-pill text-nowrap"
//             style={{ background: "#D9D9D9" }}
//           >
//             <div
//               className="rounded-circle m-0"
//               style={{
//                 width: "22px",
//                 height: "22px",
//                 background: selectedCategoryNames.includes(
//                   category.name.toLowerCase()
//                 )
//                   ? "#FFB600"
//                   : "#FFFF",
//               }}
//             ></div>
//             <span>{category.name}</span>
//           </a>
//         ))}
//     </div>
//   );
// }

// // EXAMPLES TO USE
// function FilterTagList() {
//   // ======================================================[ !mportant ]===============================================
//   const [selectedCategoryNames, setSelectedCategoryNames] = useState([]);
//   const categories = [
//     { name: "Hobby" },
//     { name: "Library" },
//     { name: "Tutoring" },
//     { name: "กลุ่มที่เข้าร่วมแล้ว" },
//     { name: "กลุ่มที่รอการตอบรับ" },
//     { name: "โพสต์ของฉัน" },
//   ];
//   // ======================================================[ !mportant ]===============================================

//   const Lists = [
//     {
//       id: 1,
//       FilterTag: ["hobby", "กลุ่มที่รอการตอบรับ"],
//       name: "Hobby กลุ่มที่รอการตอบรับ",
//     },
//     {
//       id: 2,
//       FilterTag: {
//         isCreator: false,
//         isHobby: null,
//         isLeader: false,
//         isLibrary: null,
//         isMember: true,
//         isRequest: false,
//         isTutoring: true,
//       },
//       name: "Hobby, โพสต์ของฉัน 332",
//     },
//     {
//       id: 3,
//       FilterTag: {
//         isCreator: false,
//         isHobby: null,
//         isLeader: false,
//         isLibrary: null,
//         isMember: true,
//         isRequest: false,
//         isTutoring: true,
//       },
//       name: "library กลุ่มที่รอการตอบรับ 201",
//     },
//     {
//       id: 4,
//       FilterTag: {
//         isCreator: false,
//         isHobby: null,
//         isLeader: false,
//         isLibrary: null,
//         isMember: true,
//         isRequest: false,
//         isTutoring: true,
//       },
//       name: "กลุ่มที่เข้าร่วมแล้ว 3",
//     },
//     {
//       id: 5,
//       FilterTag: {
//         isCreator: false,
//         isHobby: null,
//         isLeader: false,
//         isLibrary: null,
//         isMember: true,
//         isRequest: false,
//         isTutoring: true,
//       },
//       name: "Library, กลุ่มที่เข้าร่วมแล้ว 111",
//     },
//     {
//       id: 6,
//       FilterTag: {
//         isCreator: false,
//         isHobby: null,
//         isLeader: false,
//         isLibrary: null,
//         isMember: true,
//         isRequest: false,
//         isTutoring: true,
//       },
//       name: "tutoring, โพสต์ของฉัน 103",
//     },
//     {
//       id: 7,
//       FilterTag: {
//         isCreator: false,
//         isHobby: null,
//         isLeader: false,
//         isLibrary: null,
//         isMember: true,
//         isRequest: false,
//         isTutoring: true,
//       },
//       name: "dadadadad",
//     },
//   ];

//   // ======================================================[ !mportant ]===============================================
//   const toggleCategoryName = (name) => {
//     setSelectedCategoryNames((prevSelected) =>
//       prevSelected.includes(name)
//         ? prevSelected.filter((categoryName) => categoryName !== name)
//         : [...prevSelected, name]
//     );
//   };

//   const filteredLists = selectedCategoryNames.length
//     ? Lists.filter((list) =>
//         list.FilterTag.some((category) =>
//           selectedCategoryNames.includes(category)
//         )
//       )
//     : Lists;
//   // ======================================================[ !mportant ]===============================================

//   return (
//     <div>
//       {/* =====================================[ FilterTag ]===================================== */}
//       <FilterTag
//         selectedCategoryNames={selectedCategoryNames}
//         toggleCategoryName={toggleCategoryName}
//         categories={categories}
//       />

//       {/* =====================================[ List form filter ]===================================== */}
//       <div className="">
//         {filteredLists.map((list) => (
//           <div key={list.id}>{list.name}</div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default FilterTagList;