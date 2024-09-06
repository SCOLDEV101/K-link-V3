import axios from "axios";
import config from "./function";

export const facultiesAndMajors = [
    {
        facultyName: "คณะวิศวกรรมศาสตร์",
        majors: [
            "วิศวกรรมคอมพิวเตอร์",
            "วิศวกรรมไฟฟ้า",
            "วิศวกรรมอิเล็กทรอนิกส์",
            "วิศวกรรมเครื่องกล",
            "วิศวกรรมเชิงพาณิชย์",
            "วิศวกรรมสิ่งแวดล้อม"
        ]
    },
    {
        facultyName: "คณะเทคโนโลยีการเกษตร",
        majors: [
            "เทคโนโลยีการผลิตอาหาร",
            "เทคโนโลยีการเกษตร"
        ]
    },
    {
        facultyName: "คณะวิทยาศาสตร์",
        majors: [
            "วิทยาศาสตร์คอมพิวเตอร์",
            "เคมี",
            "ชีววิทยา",
            "ฟิสิกส์",
            "คณิตศาสตร์"
        ]
    },
    {
        facultyName: "คณะเทคโนโลยีสารสนเทศ",
        majors: [
            "เทคโนโลยีสารสนเทศ"
        ]
    },
    {
        facultyName: "คณะบริหารธุรกิจ",
        majors: [
            "บริหารธุรกิจ"
        ]
    },
    {
        facultyName: "คณะสถาปัตยกรรมศาสตร์และการออกแบบ",
        majors: [
            "สถาปัตยกรรม",
            "การออกแบบอุตสาหกรรม",
            "การออกแบบนิเทศศาสตร์"
        ]
    },
    {
        facultyName: "คณะการจัดการศึกษา",
        majors: [
            "การบริหารการศึกษา"
        ]
    }
];

export const nestDataFacultys = (data) => {
    const { faculty, major, section } = data;

    const facultyMap = faculty.reduce((acc, fac) => {
        acc[fac.facultyID] = { ...fac, departments: [] };
        return acc;
    }, {});

    const majorMap = major.reduce((acc, maj) => {
        if (!acc[maj.facultyID]) {
            acc[maj.facultyID] = [];
        }
        acc[maj.facultyID].push({
            ...maj,
            sections: [],
        });
        return acc;
    }, {});

    section.forEach((sec) => {

        const majorEntry = Object.values(majorMap)
            .flat()
            .find((maj) => maj.majorID === sec.majorID);
        if (majorEntry) {
            majorEntry.sections.push(sec);
        }
    });


    Object.keys(majorMap).forEach((facultyID) => {
        const facultyItem = facultyMap[facultyID];
        if (facultyItem) {
            facultyItem.departments = majorMap[facultyID];
        }
    });

    return Object.values(facultyMap);
};

export const getFacultyMajorSection = async () => {
    try {
        const res = await axios.get(config.API_PATH + "", { headers: config.Headers().headers });
        if (res.data.status === "ok") {
            return res.data;
        }
    } catch (error) {
        console.error("ERROR: " + error);
    }
};

export const fetchData = {
    faculty: [
        {
            facultyID: "1",
            facultyNameTH: "วิศวกรรมศาสตร์",
            facultyNameEN: "Engineer",
        },
        {
            facultyID: "2",
            facultyNameTH: "สถาปัตยกรรมศาสตร์",
            facultyNameEN: "Architecture",
        },
        {
            facultyID: "3",
            facultyNameTH: "ครุศาสตร์อุตสาหกรรมและเทคโนโลยี",
            facultyNameEN: "Education Industial Technology",
        },
        {
            facultyID: "4",
            facultyNameTH: "เทคโนโลยีการเกษตร",
            facultyNameEN: "Agricultural Technology",
        },
        {
            facultyID: "5",
            facultyNameTH: "วิทยาศาสตร์",
            facultyNameEN: "Science",
        },
        {
            facultyID: "6",
            facultyNameTH: "เทคโนโลยีสารสนเทศ",
            facultyNameEN: "Information Technology",
        },
        {
            facultyID: "7",
            facultyNameTH: "อุตสาหกรรมอาหาร",
            facultyNameEN: "Food Industry",
        },
        {
            facultyID: "8",
            facultyNameTH: "วิทยาลัยเทคโนโลยีและนวัตกรรมวัสดุ",
            facultyNameEN: "Innovative Materials Technology",
        },
        {
            facultyID: "9",
            facultyNameTH: "วิทยาลัยนวัตกรรมการผลิตขั้นสูง",
            facultyNameEN: "College of Advanced Manufacturing Innovation",
        },
        {
            facultyID: "10",
            facultyNameTH: "วิทยาลัยนานาชาติ",
            facultyNameEN: "International College",
        },
        {
            facultyID: "11",
            facultyNameTH: "บริหารธุรกิจ",
            facultyNameEN: "Business Administration",
        },
        {
            facultyID: "12",
            facultyNameTH: "ศิลปศาสตร์",
            facultyNameEN: "Liberal Arts",
        },
        {
            facultyID: "13",
            facultyNameTH: "แพทยศาสตร์",
            facultyNameEN: "Medicine",
        },
        {
            facultyID: "14",
            facultyNameTH: "วิทยาลัยวิศวกรรมสังคีต",
            facultyNameEN: "Institute of Music Science and Engineering",
        },
        {
            facultyID: "15",
            facultyNameTH: "ทันตแพทยศาสตร์ ",
            facultyNameEN: "Dentistry",
        },
        {
            facultyID: "16",
            facultyNameTH: "วิทยาลัยอุตสาหกรรมการบินนานาชาติ",
            facultyNameEN: "International Academy of Aviation Industry",
        },
    ],
    major: [
        {
            facultyID: "1",
            majorID: "ENG01",
            majorNameTH: null,
            majorNameEN: "Biomedical Engineer",
        },
        {
            facultyID: "1",
            majorID: "ENG02",
            majorNameTH: null,
            majorNameEN: "Computer Engineering",
        },
        {
            facultyID: "1",
            majorID: "ENG03",
            majorNameTH: null,
            majorNameEN: "Mechanical Engineering",
        },
        {
            facultyID: "1",
            majorID: "ENG04",
            majorNameTH: null,
            majorNameEN: "Chemical Engineering",
        },
        {
            facultyID: "1",
            majorID: "ENG05",
            majorNameTH: null,
            majorNameEN: "Civil Engineering",
        },
        {
            facultyID: "1",
            majorID: "ENG06",
            majorNameTH: null,
            majorNameEN: "Industrial Engineering",
        },
        {
            facultyID: "1",
            majorID: "ENG07",
            majorNameTH: null,
            majorNameEN: "Multidisciplinary Engineering",
        },
        {
            facultyID: "1",
            majorID: "ENG08",
            majorNameTH: "วิศวกรรมชีวการแพทย์ & แพทยศาสตรบัณฑิต",
        },
        {
            facultyID: "1",
            majorID: "ENG09",
            majorNameEN:
                "Bachelor of Engineering in Smart Materials Technology & Bachelor of Engineering in Robotics and AI Engineering",
        },
        {
            facultyID: "1",
            majorID: "ENG10",
            majorNameTH:
                "วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมระบบไอโอทีและสารสนเทศ & วิทยาศาสตรบัณฑิต สาขาวิชาฟิสิกส์อุตสาหกรรม",
            majorNameEN: null,
        },
        {
            facultyID: "1",
            majorID: "ENG11",
            majorNameTH:
                "วิทยาศาสตรบัณฑิต สาขาวิชาวิศวกรรมแปรรูปอาหาร & วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมอุตสาหการ",
            majorNameEN: null,
        },
        {
            facultyID: "1",
            majorID: "ENG12",
            majorNameTH:
                "วิศวกรรมศาสตรบัณฑิต (วิศวกรรมโยธา) & วิทยาศาสตรบัณฑิต(สถาปัตยกรรม)",
            majorNameEN: null,
        },
        {
            facultyID: "1",
            majorID: "ENG13",
            majorNameTH: "วิศวกรรมการวัดและควบคุม",
            majorNameEN: null,
        },
        {
            facultyID: "1",
            majorID: "ENG14",
            majorNameTH: "วิศวกรรมคอมพิวเตอร์",
            majorNameEN: null,
        },
        {
            facultyID: "1",
            majorID: "ENG15",
            majorNameTH: "วิศวกรรมเครื่องกล",
            majorNameEN: null,
        },
        {
            facultyID: "1",
            majorID: "ENG16",
            majorNameTH: "วิศวกรรมเคมี",
            majorNameEN: null,
        },
        {
            facultyID: "1",
            majorID: "ENG17",
            majorNameTH: "วิศวกรรมไฟฟ้า",
            majorNameEN: null,
        },
        {
            facultyID: "1",
            majorID: "ENG18",
            majorNameTH: "วิศวกรรมอุตสาหการ",
            majorNameEN: null,
        },
        {
            facultyID: "1",
            majorID: "ENG19",
            majorNameTH: "วิศวกรรมอาหาร",
            majorNameEN: null,
        },
        {
            facultyID: "1",
            majorID: "ENG20",
            majorNameTH: "วิศวกรรมอิเล็กทรอนิกส์",
            majorNameEN: null,
        },
        {
            facultyID: "1",
            majorID: "ENG21",
            majorNameTH: "วิศวกรรมโทรคมนาคม",
            majorNameEN: null,
        },
        {
            facultyID: "1",
            majorID: "ENG22",
            majorNameTH: "วิศวกรรมโยธา",
            majorNameEN: null,
        },
        {
            facultyID: "1",
            majorID: "ENG23",
            majorNameTH: "วิศวกรรมเกษตร",
            majorNameEN: null,
        },
        {
            facultyID: "2",
            majorID: "ARC01",
            majorNameTH: null,
            majorNameEN: "Bachelor of Science in Architecture",
        },
        {
            facultyID: "2",
            majorID: "ARC02",
            majorNameTH: null,
            majorNameEN:
                "Bachelor of Fine Arts in Creative Arts and Curatorial Studies",
        },
        {
            facultyID: "2",
            majorID: "ARC03",
            majorNameTH: null,
            majorNameEN:
                "Bachelor of Design Program in Design Intelligence for Creative Economy (International Program)",
        },
        {
            facultyID: "2",
            majorID: "ARC04",
            majorNameTH:
                "วิศวกรรมศาสตรบัณฑิต (วิศวกรรมโยธา) & วิทยาศาสตรบัณฑิต(สถาปัตยกรรม)",
            majorNameEN: null,
        },
        {
            facultyID: "2",
            majorID: "ARC05",
            majorNameTH: "สถาปัตยกรรม",
            majorNameEN: null,
        },
        {
            facultyID: "2",
            majorID: "ARC06",
            majorNameTH: "สถาปัตยกรรมภายใน",
            majorNameEN: null,
        },
        {
            facultyID: "2",
            majorID: "ARC07",
            majorNameTH: "ศิลปอุตสาหกรรม",
            majorNameEN: null,
        },
        {
            facultyID: "2",
            majorID: "ARC08",
            majorNameTH: "นิเทศศิลป์",
            majorNameEN: null,
        },
        {
            facultyID: "2",
            majorID: "ARC09",
            majorNameTH: "วิจิตรศิลป์",
            majorNameEN: null,
        },
        {
            facultyID: "2",
            majorID: "ARC10",
            majorNameTH: "ศิลปกรรม",
            majorNameEN: null,
        },
        {
            facultyID: "3",
            majorID: "EDU01",
            majorNameTH: "ครุศาสตร์สถาปัตยกรรม",
            majorNameEN: null,
        },
        {
            facultyID: "3",
            majorID: "EDU02",
            majorNameTH: "ครุศาสตร์วิศวกรรม",
            majorNameEN: null,
        },
        {
            facultyID: "3",
            majorID: "EDU03",
            majorNameTH: "ครุศาสตร์เกษตร",
            majorNameEN: null,
        },
        {
            facultyID: "3",
            majorID: "EDU04",
            majorNameTH: "ครุศาสตร์ภาษาและสังคม",
            majorNameEN: null,
        },
        {
            facultyID: "4",
            majorID: "AGR01",
            majorNameTH: "เทคโนโลยีการผลิตพืช",
            majorNameEN: null,
        },
        {
            facultyID: "4",
            majorID: "AGR02",
            majorNameTH: "เทคโนโลยีการผลิตสัตว์และประมง",
            majorNameEN: null,
        },
        {
            facultyID: "4",
            majorID: "AGR03",
            majorNameTH: "ปฐพีวิทยา",
            majorNameEN: null,
        },
        {
            facultyID: "4",
            majorID: "AGR04",
            majorNameTH: "เทคโนโลยีการจัดการศัตรูพืช",
            majorNameEN: null,
        },
        {
            facultyID: "4",
            majorID: "AGR05",
            majorNameTH: "นวัตกรรมการสื่อสารและพัฒนาการเกษตร",
            majorNameEN: null,
        },
        {
            facultyID: "4",
            majorID: "AGR06",
            majorNameTH: "สำนักงานบริหารหลักสูตรสหวิทยาการเทคโนโลยีการเกษตร",
            majorNameEN: null,
        },
        {
            facultyID: "5",
            majorID: "SCI01",
            majorNameTH: "คณิตศาสตร์",
            majorNameEN: null,
        },
        {
            facultyID: "5",
            majorID: "SCI02",
            majorNameTH: "วิทยาการคอมพิวเตอร์",
            majorNameEN: null,
        },
        {
            facultyID: "5",
            majorID: "SCI03",
            majorNameTH: "เคมี",
            majorNameEN: null,
        },
        {
            facultyID: "5",
            majorID: "SCI04",
            majorNameTH: "ชีววิทยา",
            majorNameEN: null,
        },
        {
            facultyID: "5",
            majorID: "SCI05",
            majorNameTH: "ฟิสิกส์",
            majorNameEN: null,
        },
        {
            facultyID: "5",
            majorID: "SCI06",
            majorNameTH: "สถิติ",
            majorNameEN: null,
        },
        {
            facultyID: "5",
            majorID: "SCI07",
            majorNameTH: "ศูนย์วิเคราะห์ข้อมูลดิจิทัลอัจฉริยะพระจอมเกล้าลาดกระบัง",
            majorNameEN: null,
        },
        {
            facultyID: "6",
            majorID: "INF01",
            majorNameTH: "เทคโนโลยีสารสนเทศ",
            majorNameEN: null,
        },
        {
            facultyID: "7",
            majorID: "FOO01",
            majorNameTH:
                "วิทยาศาสตรบัณฑิต สาขาวิชาวิศวกรรมแปรรูปอาหาร & วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมอุตสาหการ",
            majorNameEN: null,
        },
        {
            facultyID: "7",
            majorID: "FOO02",
            majorNameTH: "อุตสาหกรรมอาหาร",
            majorNameEN: null,
        },
        {
            facultyID: "8",
            majorID: "NAN01",
            majorNameTH: "นาโนวิทยาและนาโนเทคโนโลยี ",
            majorNameEN: null,
        },
        {
            facultyID: "8",
            majorID: "NAN02",
            majorNameTH: null,
            majorNameEN: "Multidisciplinary",
        },
        {
            facultyID: "8",
            majorID: "NAN03",
            majorNameTH: "วิศวกรรมวัสดุนาโน & Polymer Materials and Engineering",
            majorNameEN: null,
        },
        {
            facultyID: "9",
            majorID: "ADV01",
            majorNameTH: "วิศวกรรมระบบการผลิต",
            majorNameEN: null,
        },
        {
            facultyID: "10",
            majorID: "INT01",
            majorNameTH: "วิศวกรรมซอฟต์แวร์",
            majorNameEN: null,
        },
        {
            facultyID: "10",
            majorID: "INT02",
            majorNameTH: "การจัดการวิศวกรรมและเทคโนโลยี",
            majorNameEN: null,
        },
        {
            facultyID: "11",
            majorID: "BUS01",
            majorNameTH: "บริหารธุรกิจเกษตร",
            majorNameEN: null,
        },
        {
            facultyID: "11",
            majorID: "BUS02",
            majorNameTH: "บริหารธุรกิจ",
            majorNameEN: null,
        },
        {
            facultyID: "11",
            majorID: "BUS03",
            majorNameTH: "เศรษฐศาสตร์ธุรกิจและการจัดการ",
            majorNameEN: null,
        },
        {
            facultyID: "12",
            majorID: "LIB01",
            majorNameTH: "ศิลปศาสตร์ประยุกต์",
            majorNameEN: null,
        },
        {
            facultyID: "12",
            majorID: "LIB02",
            majorNameTH: "ภาษา",
            majorNameEN: null,
        },
        {
            facultyID: "12",
            majorID: "LIB03",
            majorNameTH: "มนุษยศาสตร์และสังคมศาสตร์",
            majorNameEN: null,
        },
        {
            facultyID: "13",
            majorID: "MED01",
            majorNameTH: "แพทยศาสตรนานาชาติ",
            majorNameEN: null,
        },
        {
            facultyID: "14",
            majorID: "MUS01",
            majorNameTH: "วิศวกรรมดนตรีและสื่อประสม",
            majorNameEN: null,
        },
        {
            facultyID: "15",
            majorID: "DEN01",
            majorNameTH: "ทันตแพทยศาสตร์ ",
            majorNameEN: "Dentistry",
        },
        {
            facultyID: "16",
            majorID: "AIR01",
            majorNameTH: "วิศวกรรมเครื่องกล ",
            majorNameEN: null,
        },
        {
            facultyID: "16",
            majorID: "AIR02",
            majorNameTH: "วิศวกรรมการบิน ",
            majorNameEN: null,
        },
        {
            facultyID: "16",
            majorID: "AIR03",
            majorNameTH: "นวัตกรรมการจัดการอุตสาหกรรมการบินและการบริการ ",
            majorNameEN: null,
        },
    ],

    section: [
        {
            majorID: "ENG01",
            sectionID: "1",
            sectionName: "Bachelor of Engineering in Biomedical Engineering",
        },
        {
            majorID: "ENG02",
            sectionID: "2",
            sectionName: "Bachelor of Engineering in Software Engineering",
        },
        {
            majorID: "ENG02",
            sectionID: "3",
            sectionName: "Bachelor of Engineering in Computer Engineering",
        },
        {
            majorID: "ENG03",
            sectionID: "4",
            sectionName: "Bachelor of Engineering in Mechanical Engineering",
        },
        {
            majorID: "ENG04",
            sectionID: "5",
            sectionName: "Bachelor of Engineering in Chemical Engineering",
        },
        {
            majorID: "ENG05",
            sectionID: "6",
            sectionName: "Bachelor of Engineering in Civil Engineering",
        },
        {
            majorID: "ENG05",
            sectionID: "7",
            sectionName:
                "Bachelor of Engineering in Engineering Management and Entrepreneurship",
        },
        {
            majorID: "ENG06",
            sectionID: "8",
            sectionName:
                "Bachelor of Engineering in Industrial Engineering and Digital Management Systems",
        },
        {
            majorID: "ENG06",
            sectionID: "9",
            sectionName:
                "Bachelor of Engineering in Industrial Engineering and Logistics Management",
        },
        {
            majorID: "ENG06",
            sectionID: "10",
            sectionName: "Bachelor of Engineering in Financial Engineering",
        },
        {
            majorID: "ENG07",
            sectionID: "11",
            sectionName: "Bachelor of Engineering in Computer Innovation Engineering",
        },
        {
            majorID: "ENG07",
            sectionID: "12",
            sectionName:
                "Bachelor of Engineering in Robotics and Artificial Intelligence Engineering",
        },
        {
            majorID: "ENG07",
            sectionID: "13",
            sectionName: "Bachelor of Bachelor of Engineering in Energy Engineering",
        },
        {
            majorID: "ENG07",
            sectionID: "14",
            sectionName:
                "Bachelor of Engineering in Robotics and Artificial Intelligence Engineering",
        },
        {
            majorID: "ENG07",
            sectionID: "15",
            sectionName: "Bachelor of Engineering in Electrical Engineering",
        },
        {
            majorID: "ENG13",
            sectionID: "16",
            sectionName: "สาขาวิชาวิศวกรรมการวัดคุม",
        },
        {
            majorID: "ENG13",
            sectionID: "17",
            sectionName: "สาขาวิชาวิศวกรรมการวัดคุม (ต่อเนื่อง)",
        },
        {
            majorID: "ENG13",
            sectionID: "18",
            sectionName: "สาขาวิชาวิศวกรรมอัตโนมัติ",
        },
        {
            majorID: "ENG13",
            sectionID: "19",
            sectionName: "สาขาวิชาวิศวกรรมระบบควบคุม",
        },
        {
            majorID: "ENG13",
            sectionID: "20",
            sectionName: "สาขาวิชาวิศวกรรมแมคคาทรอนิกส์",
        },
        {
            majorID: "ENG13",
            sectionID: "21",
            sectionName: "สาขาวิชาวิศวกรรมเมคคาทรอนิกส์และออโตเมชัน",
        },
        {
            majorID: "ENG14",
            sectionID: "22",
            sectionName: "สาขาวิชาวิศวกรรมคอมพิวเตอร์",
        },
        {
            majorID: "ENG14",
            sectionID: "23",
            sectionName: "สาขาวิชาวิศวกรรมคอมพิวเตอร์ (ต่อเนื่อง)",
        },
        {
            majorID: "ENG14",
            sectionID: "24",
            sectionName: "สาขาวิชาวิศวกรรมคอมพิวเตอร์",
        },
        {
            majorID: "ENG14",
            sectionID: "25",
            sectionName: "สาขาวิชาวิศวกรรมคอมพิวเตอร์ (ต่อเนื่อง)",
        },
        {
            majorID: "ENG14",
            sectionID: "26",
            sectionName: "สาขาวิชาวิศวกรรมสารสนเทศ",
        },
        {
            majorID: "ENG14",
            sectionID: "27",
            sectionName: "สาขาวิชาวิศวกรรมดนตรีและสื่อประสม",
        },
        {
            majorID: "ENG14",
            sectionID: "28",
            sectionName: "สาขาวิชาวิศวกรรมระบบไอโอทีและสารสนเทศ",
        },
        {
            majorID: "ENG15",
            sectionID: "29",
            sectionName: "สาขาวิชาวิศวกรรมเครื่องกล",
        },
        {
            majorID: "ENG15",
            sectionID: "30",
            sectionName: "สาขาวิชาวิศวกรรมขนส่งทางราง",
        },
        {
            majorID: "ENG16",
            sectionID: "31",
            sectionName: "สาขาวิชาวิศวกรรมเคมี",
        },
        {
            majorID: "ENG16",
            sectionID: "32",
            sectionName: "สาขาวิชาวิศวกรรมปิโตรเคมี",
        },
        {
            majorID: "ENG17",
            sectionID: "33",
            sectionName: "สาขาวิชาวิศวกรรมไฟฟ้า",
        },
        {
            majorID: "ENG17",
            sectionID: "34",
            sectionName: "สาขาวิชาวิศวกรรมพลังงานไฟฟ้า",
        },
        {
            majorID: "ENG18",
            sectionID: "35",
            sectionName: "สาขาวิชาวิศวกรรมอุตสาหการ",
        },
        {
            majorID: "ENG18",
            sectionID: "36",
            sectionName: "สาขาวิชาวิศวกรรมออกแบบการผลิตและวัสดุ",
        },
        {
            majorID: "ENG18",
            sectionID: "37",
            sectionName: "สาขาวิชาวิศวกรรมการผลิตเชิงบูรณาการ",
        },
        {
            majorID: "ENG19",
            sectionID: "38",
            sectionName: "สาขาวิชาวิศวกรรมอาหาร",
        },
        {
            majorID: "ENG20",
            sectionID: "39",
            sectionName: "สาขาวิชาวิศวกรรมอิเล็กทรอนิกส์",
        },
        {
            majorID: "ENG21",
            sectionID: "40",
            sectionName: "สาขาวิชาวิศวกรรมโทรคมนาคม",
        },
        {
            majorID: "ENG21",
            sectionID: "41",
            sectionName: "สาขาวิชาวิศวกรรมโทรคมนาคมและโครงข่าย",
        },
        {
            majorID: "ENG21",
            sectionID: "42",
            sectionName: "สาขาวิชาวิศวกรรมไฟฟ้าสื่อสารและอิเล็กทรอนิกส์ (ต่อเนื่อง)",
        },
        {
            majorID: "ENG22",
            sectionID: "43",
            sectionName: "สาขาวิชาวิศวกรรมโยธา",
        },
        {
            majorID: "ENG22",
            sectionID: "44",
            sectionName: "สาขาวิชาวิศวกรรมโยธา (ต่อเนื่อง)",
        },
        {
            majorID: "ENG23",
            sectionID: "45",
            sectionName: "สาขาวิชาวิศวกรรมเกษตร",
        },
        {
            majorID: "ENG23",
            sectionID: "46",
            sectionName: "สาขาวิชาวิศวกรรมระบบอุตสาหกรรมการเกษตร (ต่อเนื่อง)",
        },
        {
            majorID: "ENG23",
            sectionID: "47",
            sectionName: "วิศวกรรมเกษตรอัจฉริยะ",
        },
        {
            majorID: "ARC05",
            sectionID: "48",
            sectionName: "สาขาวิชาสถาปัตยกรรมหลัก",
        },
        {
            majorID: "ARC05",
            sectionID: "49",
            sectionName: "ภูมิสถาปัตยกรรมศาสตรบัณฑิต",
        },
        {
            majorID: "ARC06",
            sectionID: "50",
            sectionName: "สาขาวิชาสถาปัตยกรรมภายใน",
        },
        {
            majorID: "ARC07",
            sectionID: "51",
            sectionName: "สาขาวิชาการออกแบบสนเทศสามมิติ",
        },
        {
            majorID: "ARC07",
            sectionID: "52",
            sectionName: "สาขาวิชาการออกแบบอุตสาหกรรม",
        },
        {
            majorID: "ARC07",
            sectionID: "53",
            sectionName: "สาขาวิชาศิลปอุตสาหกรรม",
        },
        {
            majorID: "ARC07",
            sectionID: "54",
            sectionName: "สาขาวิชาการออกแบบสนเทศสามมิติและสื่อบูรณาการ",
        },
        { majorID: "ARC08", sectionID: "55", sectionName: "สาขาวิชาการถ่ายภาพ" },
        { majorID: "ARC08", sectionID: "56", sectionName: "สาขาวิชานิเทศศิลป์" },
        {
            majorID: "ARC08",
            sectionID: "57",
            sectionName: "สาขาวิชาภาพยนตร์และดิจิทัล มีเดีย",
        },
        { majorID: "ARC09", sectionID: "58", sectionName: "สาขาวิชาจิตรกรรม" },
        { majorID: "ARC09", sectionID: "59", sectionName: "สาขาวิชาภาพพิมพ์" },
        { majorID: "ARC09", sectionID: "60", sectionName: "สาขาวิชาประติมากรรม" },
        {
            majorID: "ARC10",
            sectionID: "61",
            sectionName: "สาขาวิชาจิตรกรรมและมีเดียอาตส์",
        },
        {
            majorID: "ARC10",
            sectionID: "62",
            sectionName: "สาขาวิชาประติมากรรมและประติมากรรมเพื่อสังคม",
        },
        {
            majorID: "ARC10",
            sectionID: "63",
            sectionName: "สาขาวิชาภาพพิมพ์และอิลลัสเตชั่น",
        },
        {
            majorID: "ARC10",
            sectionID: "64",
            sectionName: "สาขาวิชาศิลปกรรม มีเดียอาร์ต และอิลลัสเตชันอาร์ต",
        },
        { majorID: "EDU01", sectionID: "65", sectionName: "สาขาวิชาสถาปัตยกรรม" },
        {
            majorID: "EDU01",
            sectionID: "66",
            sectionName: "สาขาวิชาการออกแบบสภาพแวดล้อมภายใน",
        },
        {
            majorID: "EDU01",
            sectionID: "67",
            sectionName: "สาขาวิชาครุศาสตร์การออกแบบ",
        },
        {
            majorID: "EDU01",
            sectionID: "68",
            sectionName: "สาขาวิชานวัตกรรมและเทคโนโลยีการออกแบบ",
        },
        {
            majorID: "EDU01",
            sectionID: "69",
            sectionName: "สาขาวิชาบูรณาการนวัตกรรมเพื่อสินค้าและบรการ",
        },
        {
            majorID: "EDU02",
            sectionID: "70",
            sectionName: "สาขาวิชาครุศาสตร์วิศวกรรม",
        },
        {
            majorID: "EDU02",
            sectionID: "71",
            sectionName: "สาขาวิชาเทคโนโลยีคอมพิวเตอร์",
        },
        {
            majorID: "EDU02",
            sectionID: "72",
            sectionName: "สาขาวิชาอิเล็กทรอนิกส์และโทรคมนาคม",
        },
        {
            majorID: "EDU02",
            sectionID: "73",
            sectionName: "สาขาวิชาเทคโนโลยีอิเล็กทรอนิกส์",
        },
        {
            majorID: "EDU03",
            sectionID: "74",
            sectionName: "สาขาวิชาครุศาสตร์เกษตร",
        },
        {
            majorID: "EDU03",
            sectionID: "75",
            sectionName: "สาขาวิชาเทคโนโลยีชีวภาพทางการเกษตร (ต่อเนื่อง)",
        },
        { majorID: "EDU04", sectionID: "76", sectionName: "สาขาวิชาภาษาอังกฤษ" },
        { majorID: "EDU04", sectionID: "77", sectionName: "สาขาวิชาภาษาญี่ปุ่น" },
        { majorID: "AGR01", sectionID: "78", sectionName: "สาขาวิชาเกษตรศาสตร์" },
        {
            majorID: "AGR01",
            sectionID: "79",
            sectionName: "สาขาวิชาเทคโนโลยีการผลิตพืช",
        },
        { majorID: "AGR02", sectionID: "80", sectionName: "สาขาวิชาสัตวศาสตร์" },
        {
            majorID: "AGR02",
            sectionID: "81",
            sectionName: "สาขาวิชาเทคโนโลยีการผลิตสัตว์และวิทยาศาสตร์เนื้อสัตว์",
        },
        {
            majorID: "AGR02",
            sectionID: "82",
            sectionName: "สาขาวิชาวิทยาศาสตร์การประมง",
        },
        {
            majorID: "AGR02",
            sectionID: "83",
            sectionName: "สาขาวิชานวัตกรรมการผลิตสัตว์น้ำ และการจัดการทรัพยากรประมง",
        },
        {
            majorID: "AGR03",
            sectionID: "84",
            sectionName: "สาขาวิชาการจัดการทรัพยากรดินและสิ่งแวดล้อม",
        },
        {
            majorID: "AGR04",
            sectionID: "85",
            sectionName: "สาขาวิชาเทคโนโลยีการจัดการศัตรูพืช",
        },
        {
            majorID: "AGR05",
            sectionID: "86",
            sectionName: "สาขาวิชาพัฒนาการเกษตร",
        },
        {
            majorID: "AGR05",
            sectionID: "87",
            sectionName: "สาขาวิชานิเทศศาสตร์เกษตร",
        },
        {
            majorID: "AGR06",
            sectionID: "88",
            sectionName: "สาขาวิชาการจัดการสมาร์ตฟาร์ม",
        },
        {
            majorID: "AGR06",
            sectionID: "89",
            sectionName: "สาขาวิชาการออกแบบและการจัดการภูมิทัศน์เพื่อสิ่งแวดล้อม",
        },
        {
            majorID: "AGR06",
            sectionID: "90",
            sectionName: "สาขาวิชาเศษฐศาสตร์และธุรกิจเพื่อพัฒนาการเกษตร",
        },
        {
            majorID: "SCI01",
            sectionID: "91",
            sectionName: "สาขาวิชาคณิตศาสตร์ประยุกต์",
        },
        {
            majorID: "SCI02",
            sectionID: "92",
            sectionName: "สาขาวิชาวิทยาการคอมพิวเตอร์",
        },
        {
            majorID: "SCI03",
            sectionID: "93",
            sectionName: "สาขาวิชาเคมีสิ่งแวดล้อม",
        },
        {
            majorID: "SCI03",
            sectionID: "94",
            sectionName: "สาขาวิชาเคมีอุตสาหกรรม",
        },
        {
            majorID: "SCI03",
            sectionID: "95",
            sectionName: "สาขาวิชาเคมีวิศวกรรมและอุตสาหกรรม (หลักสูตรนานาชาติ)",
        },
        {
            majorID: "SCI03",
            sectionID: "96",
            sectionName: "สาขาวิชาเทคโนโลยีสิ่งแวดล้อมและการจัดการอย่างยั่งยืน",
        },
        {
            majorID: "SCI04",
            sectionID: "97",
            sectionName: "สาขาวิชาเทคโนโลยีชีวภาพ",
        },
        {
            majorID: "SCI04",
            sectionID: "98",
            sectionName: "สาขาวิชาจุลชีววิทยาอุตสาหกรรม",
        },
        {
            majorID: "SCI04",
            sectionID: "99",
            sectionName: "สาขาวิชาเทคโนโลยีชีวภาพอุตสาหกรรม",
        },
        {
            majorID: "SCI04",
            sectionID: "100",
            sectionName: "สาขาวิชาจุลชีววิทยาอุตสาหกรรม (นานาชาติ)",
        },
        {
            majorID: "SCI04",
            sectionID: "101",
            sectionName: "สาขาวิชาจุลชีววิทยาอุตสาหกรรม",
        },
        {
            majorID: "SCI05",
            sectionID: "102",
            sectionName: "สาขาวิชาฟิสิกส์ประยุกต์",
        },
        {
            majorID: "SCI05",
            sectionID: "103",
            sectionName: "สาขาวิชาฟิสิกส์อุตสาหกรรม",
        },
        {
            majorID: "SCI05",
            sectionID: "104",
            sectionName: "สาขาวิชาวิศวกรรมระบบไอโอทีและสารสนเทศ (2 ปริญญา)",
        },
        {
            majorID: "SCI06",
            sectionID: "105",
            sectionName: "สาขาวิชาสถิติประยุกต์",
        },
        {
            majorID: "SCI06",
            sectionID: "106",
            sectionName: "สาขาสถิติประยุกต์และการวิเคราะห์ข้อมูล",
        },
        {
            majorID: "SCI07",
            sectionID: "107",
            sectionName:
                "Bachelor of Science Digital Technology and Integrated Innovation",
        },
        {
            majorID: "FOO02",
            sectionID: "108",
            sectionName: "สาขาวิชาเทคโนโลยีการหมักในอุตสาหกรรม",
        },
        {
            majorID: "FOO02",
            sectionID: "109",
            sectionName: "สาขาวิชาเทคโนโลยีการหมักในอุตสาหกรรมอาหาร",
        },
        {
            majorID: "FOO02",
            sectionID: "110",
            sectionName: "สาขาวิชาวิทยาศาสตร์และเทคโนโลยีการอาหาร",
        },
        {
            majorID: "FOO02",
            sectionID: "111",
            sectionName: "สาขาวิชาวิศวกรรมแปรรูปอาหาร",
        },
        {
            majorID: "FOO02",
            sectionID: "112",
            sectionName: "สาขาวิชาอุตสาหกรรมเกษตร",
        },
        {
            majorID: "FOO02",
            sectionID: "113",
            sectionName:
                "วิทยาศาสตร์การประกอบอาหารและการจัดการบริการอาหาร (หลักสูตรนานาชาติ)",
        },
        {
            majorID: "FOO01",
            sectionID: "114",
            sectionName:
                "วิทยาศาสตรบัณฑิต สาขาวิชาวิศวกรรมแปรรูปอาหาร & วิศวกรรมศาสตรบัณฑิต สาขาวิชาวิศวกรรมอุตสาหการ",
        },
        {
            majorID: "INF01",
            sectionID: "115",
            sectionName: "สาขาวิชาเทคโนโลยีสารสนเทศ",
        },
        {
            majorID: "INF01",
            sectionID: "116",
            sectionName: "สาขาวิชาเทคโนโลยีสารสนเทศทางธุรกิจ (นานาชาติ)",
        },
        {
            majorID: "INF01",
            sectionID: "117",
            sectionName: "สาขาวิชาวิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจ",
        },
        {
            majorID: "INF01",
            sectionID: "118",
            sectionName: "สาขาวิชาเทคโนโลยีปัญญาประดิษฐ์",
        },
        {
            majorID: "BUS01",
            sectionID: "119",
            sectionName: "สาขาวิชาบริหารธุรกิจเกษตร",
        },
        {
            majorID: "BUS02",
            sectionID: "120",
            sectionName: "สาขาวิชาบริหารธุรกิจ",
        },
        {
            majorID: "BUS02",
            sectionID: "121",
            sectionName: "สาขาวิชาบริหารธุรกิจ (นานาชาติ)",
        },
        {
            majorID: "BUS02",
            sectionID: "122",
            sectionName:
                "Bachelor of Business Administration in Global Entrepreneurship (International Program)",
        },
        {
            majorID: "BUS03",
            sectionID: "123",
            sectionName: "วิทยาศาสตรบัณฑิต สาขาวิชาเศรษฐศาสตร์ธุรกิจและการจัดการ",
        },
        {
            majorID: "BUS03",
            sectionID: "124",
            sectionName: "เศรษฐศาสตรบัณฑิต สาขาวิชาเศรษฐศาสตร์ธุรกิจและการจัดการ",
        },
        { majorID: "LIB01", sectionID: "125", sectionName: "สาขาวิชาภาษาอังกฤษ" },
        {
            majorID: "LIB02",
            sectionID: "126",
            sectionName: "สาขาวิชาภาษาญี่ปุ่น",
        },
        { majorID: "LIB02", sectionID: "127", sectionName: "สาขาวิชาภาษาอังกฤษ" },
        {
            majorID: "LIB02",
            sectionID: "128",
            sectionName: "สาขาวิชาภาษาจีนเพื่ออุตสาหกรรม",
        },
        {
            majorID: "LIB02",
            sectionID: "129",
            sectionName: "สาขาวิชาภาษาญี่ปุ่นธุรกิจ",
        },
        {
            majorID: "LIB03",
            sectionID: "130",
            sectionName: "สาขาวิชานวัตกรรมการท่องเที่ยวและการบริการ",
        },
        { majorID: "MED01", sectionID: "131", sectionName: "สาขาวิชาแพทยศาสตร์" },
        {
            majorID: "DEN01",
            sectionID: "132",
            sectionName: "ทันตแพทยศาสตรบัณฑิต (หลักสูตรนานาชาติ)",
        },
        {
            majorID: "MUS01",
            sectionID: "133",
            sectionName: "สาขาวิชาเทคโนโลยีและศิลปะสร้างสรรค์",
        },
        {
            majorID: "MUS01",
            sectionID: "134",
            sectionName: "สาขาวิชาวิศวกรรมดนตรีและสื่อประสม",
        },
        {
            majorID: "INT01",
            sectionID: "135",
            sectionName: "สาขาวิชาวิศวกรรมซอฟต์แวร์ (นานาชาติ)",
        },
        {
            majorID: "INT02",
            sectionID: "136",
            sectionName: "สาขาวิชาการจัดการวิศวกรรมและเทคโนโลยี (นานาชาติ)",
        },
        {
            majorID: "NAN01",
            sectionID: "137",
            sectionName: "สาขาวิชาวิศวกรรมวัสดุนาโน (นานาชาติ)",
        },
        {
            majorID: "NAN02",
            sectionID: "138",
            sectionName:
                "achelor of Engineering in Smart Materials Technology (Multidisciplinary)(International Program) (นานาชาติ)",
        },
        {
            majorID: "ADV01",
            sectionID: "139",
            sectionName: "สาขาวิชาวิศวกรรมระบบการผลิต",
        },
        {
            majorID: "ADV01",
            sectionID: "140",
            sectionName: "สาขาวิชาวิศวกรรมระบบการผลิต (ต่อเนื่อง)",
        },
        {
            majorID: "AIR01",
            sectionID: "141",
            sectionName: "สาขาวิชาวิศวกรรมการบินและนักบินพาณิชย์",
        },
        {
            majorID: "AIR02",
            sectionID: "142",
            sectionName: "สาขาวิชาวิศวกรรมการบินและนักบินพาณิชย์ (นานาชาติ)",
        },
        {
            majorID: "AIR02",
            sectionID: "143",
            sectionName: "สาขาวิชาวิศวกรรมการบินและอวกาศ (หลักสูตรนานาชาติ)",
        },
        {
            majorID: "AIR03",
            sectionID: "144",
            sectionName: "สาขาวิชาการจัดการโลจิสติกส์ (นานาชาติ)",
        },
        {
            majorID: "AIR03",
            sectionID: "145",
            sectionName: "สาขาวิชาการจัดการโลจิสติกส์และนวัตกรรม (หลักสูตรนานาชาติ)",
        },
    ],
};