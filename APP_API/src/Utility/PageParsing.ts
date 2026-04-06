


export const TO_ENGLISH_TABLE = {
    'สถานะนิติบุคคล': 'Status',
    'วันที่จดทะเบียนจัดตั้ง': 'Registered Date',
    'ทุนจดทะเบียน': 'Registered Capital',
    'เลขทะเบียนเดิม': 'Last Registered ID',
    'ปีที่ส่งงบการเงิน': 'Fiscal Year (submitted financial statement)',
    'โทรศัพท์': 'Telephone',
    'โทรสาร': 'Fax',
    'รายชื่อผู้เป็นหุ้นส่วน': 'Board of Partners List',
    'หุ้นส่วนผู้จัดการ': 'Managing Partner',
    'รายชื่อกรรมการ': 'Board of Directors List',
    'กรรมการ': 'Board of Directors List',
    'กรรมการลงชื่อผูกพัน': 'Authorized director',
    'ประเภทธุรกิจตอนจดทะเบียน': 'Industry group in registered document',
    'วัตถุประสงค์ของสมาคมการค้า/หอการค้า': 'Industry group in registered document',
    'ประเภทธุรกิจที่ส่งงบการเงินปีล่าสุด': 'Industry group in the latest financial statement',
    'วัตถุประสงค์ตอนจดทะเบียน': 'Business Objective in registered document',
    'วัตถุประสงค์ที่ส่งงบการเงินปีล่าสุด': 'Business Objective in the latest financial statement',
    'หมายเหตุ': 'Remark(s)',
    'บริษัทจำกัด': 'Company Limited',
    'ห้างหุ้นส่วนจำกัด': 'Ordinary Partnership',
    'ประเภทนิติบุคคล': 'Registered Type',
    'ทะเบียนสมาชิก': 'Member Registration',
    'จำนวนกรรมการ': 'Number of committees',
    'วันที่เสร็จการชำระบัญชี': 'Liquidation Completion Date',
    'ชื่อนิติบุคคล': 'Juristic Person Name',
    'เลขทะเบียนนิติบุคคล': 'Registered No.',
    'สถานะ': 'Status',
    'ยังดำเนินกิจการอยู่': 'Operating',
    'สมาคมการค้า': 'Trade of Association',
    'วันที่เลิก': 'Dissolution Date',
    'เสร็จการชำระบัญชี': 'Liquidation Completion',
    'เลิก': 'Dissolution',
    'วันที่จดทะเบียนเลิก': 'Registered Dissolution Date',
    'กลุ่มธุรกิจ': 'Business Group',
    'ขนาดธุรกิจ': 'Business Size',
    'ที่ตั้งสำนักงานแห่งใหญ่': 'Address',
};
export function convertThaiWordsToEnglish(v) {
  if (v == null) {
    return v;
  }

  if (typeof v == "string") {
    if (v in TO_ENGLISH_TABLE) {
      return TO_ENGLISH_TABLE[v];
    }
  }

  if (v instanceof Array) {
    let vv = [];
    for (let i = 0; i < v.length; i++) {
      vv.push(convertThaiWordsToEnglish(v[i]));
    }

    return vv;
  }

  if (typeof v == "object") {
    let vv = {};
    for (let k in v) {
      vv[k] = convertThaiWordsToEnglish(v[k]);
    }

    return vv;
  }

  return v;
}

export const mapFieldsForDTODictonary = {
  Address: "address",
  Status: "status",
  "Registered Type": "entType",
  "Registered Date": "establishDate",
  "Registered Capital": "regCapital",
  "Last Registered ID": "lastRegisteredID",
  "Fiscal Year (submitted financial statement)": "fiscalYear",
  Telephone: "phoneNumber",
  Fax: "fax",
  Website: "webSite",
  "E-mail address": "emailAddress",
  "Authorized director": "authorizedDirector",
  "Board of Directors List": "majorPerson",
  "Board of Partners List": "shareHolders",
  "Industry group in registered document": "registeredIndustry",
  "Industry group in the latest financial statement": "financiallIndustry",
  "Business Objective in registered document": "registrationObjective",
  "Business Objective in the latest financial statement": "financialObjective",
  "Member Registration": "memberRegistration",
  "Number of committees": "numberCommittees",
  "Registered Dissolution Date": "registeredDissolutionDate",
  "Managing Partner": "managingPartner",
  "Liquidation Completion Date": "liquidationCompletionDate",
  "Dissolution Date": "dissolutionDate",
  "Business Group": "businessGroup",
  "Business Size": "businessSize",
};

export function mapFieldsForDataTransfer(v) {
  v = convertThaiWordsToEnglish(v);
  if (v in mapFieldsForDTODictonary) {
    return mapFieldsForDTODictonary[v];
  }

  return null;
}

export function to_english_date(dt) {
  // 泰国时间转换
  // 23 ก.ย. 2541
  // http://www.snz010.com/xinwen_3/40716555.html
  const th_months = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const en_months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
    "Unk",
  ];

  let m = /(\d+)\s([^\s]+)\s(\d+)/.exec(dt);
  if (m != null) {
    let day = m[1];
    if (day.length == 1) day = `0${day}`;

    let month: string | number = th_months.indexOf(m[2]);
    if (month == -1) {
      month = en_months[en_months.length - 1];
    } else {
      month = en_months[month];
    }

    let year = parseInt(m[3]) - 543;
    return `${day} ${month} ${year}`;
  }

  return dt;
}

export function handleHtml(html) {
  // if (typeof html === 'string') {
  //     return html.replace(/\r\n[a-zA-Z0-9]{2,3}\r\n/g, '').replace(/[a-zA-Z0-9]{2,3}\r\n/g, '')
  // }
  // else {
  return html || "";
  // }
}

export function isEmptryString(s) {
  return s == null || s.length == 0;
}

export function handleNull(val) {
  if (typeof val === "string") {
    if (val === "-") {
      return "";
    }
    return val.replace(/\n/g, "").replace(/\t/g, "");
  }
  if (typeof val === "object" && val.includes("-")) {
    if (val.includes("-")) {
      return val.filter((i) => i !== "-");
    }
    return val.map((i) => {
      if (typeof i === "string") {
        return i.replace(/\n/g, "").replace(/\t/g, "");
      } else {
        return i;
      }
    });
  }
  return val;
}
