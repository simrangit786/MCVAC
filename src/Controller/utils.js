import { Image as Images } from "../Components/Images";
import moment from "moment";
import { data } from "jquery";
import { getUserRole } from "./localStorageHandler";
const _ = require('lodash')

export function getShortName(first_name, last_name) {
  return (
    (first_name && first_name[0] && first_name[0]) +
    (last_name && last_name[0] && last_name[0])
  );
}

export function formatPrice(price) {
  if (price) return parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2 })
  return price
}

export function titleCase(str) {
  str = str?.toLowerCase().split("_");
  for (var i = 0; i < str?.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str?.join(" ");
}

export function formatFileSize(bytes, decimalPoint = 2) {
  if (bytes == 0) return "0 Bytes";
  let k = 1000,
    dm = decimalPoint,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatPhone(phone) {
  return phone
    ? phone
      .match(/\d*/g)
      .join("")
      .match(/(\d{0,3})(\d{0,3})(\d{0,14})/)
      .slice(1)
      .join("-")
      .replace(/-*$/g, "")
    : "-";
}

export function formatDuns(duns) {
  return (
    duns &&
    duns
      .match(/\d*/g)
      .join("")
      .match(/(\d{0,2})(\d{0,3})(\d{0,4})/)
      .slice(1)
      .join("-")
      .replace(/-*$/g, "")
  );
}
export function formatEin(ein) {
  return (
    ein &&
    ein
      .match(/\d*/g)
      .join("")
      .match(/(\d{0,2})(\d{0,7})/)
      .slice(1)
      .join("-")
      .replace(/-*$/g, "")
  );
}

export function getActiveKey(activeKey, lastStepKey) {
  // console.log(activeKey, lastStepKey, "key")
  activeKey = parseInt(activeKey) + 1;
  // console.log(activeKey, "updated")
  if (activeKey > parseInt(lastStepKey)) {
    // 7 here represent last step key
    activeKey = 0;
  }
  return activeKey.toString();
}

export function formatDate(date) {
  return date ? moment(date).format("MMM D,YYYY") : "-";
}

export function formatMoney(value) {
  return value ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
}

export function parseMoney(value) {
  return value ? value.replace(/\$\s?|(,*)/g, "") : "";
}

export function getPercentedValue(percent, value) {
  return ((percent / 100) * value).toFixed(2) || 0;
}

export function getIncrementDate(incrementDate, incrementValue) {
  let dateFormatTotime = new Date(incrementDate);
    let increasedDate = new Date(
      dateFormatTotime.getTime() + incrementValue * 86400000
    );
   return increasedDate;
}

export function getDecrementDate(decrementDate, decrementValue) {
  let dateFormatTotime = new Date(decrementDate);
    let decreasedDate = new Date(
      dateFormatTotime.getTime() - decrementValue * 86400000
    );
   return decreasedDate;
}

export function vehicleCalculations(data) {
  let res = {
    data,
  };
  if (!res.data) {
    return 0;
  }
  let calculated = {
    per_day_dpr: (
      res.data.purchase_cost /
      res.data.estimated_life /
      res.data.estimated_days || 0
    ).toFixed(2),
    insurance_per_day: (
      res.data.annual_premium / res.data.estimated_days || 0
    ).toFixed(2),
    fuel_per_day: (
      res.data.average_price * res.data.average_gallon || 0
    ).toFixed(2),
    reg_per_day: (res.data.annual_fee / res.data.estimated_days || 0).toFixed(
      2
    ),
    permit_per_day: (
      res.data.annual_permit_fee / res.data.estimated_days || 0
    ).toFixed(2),
    maintenance_per_day: (
      res.data.maintenance_per_year / res.data.estimated_days || 0
    ).toFixed(2),
    other_cost_per_day: (
      res.data.other_cost_per_year / res.data.estimated_days || 0
    ).toFixed(2),
  };
  // let total = parseFloat(calculated.per_day_dpr.toFixed(2)) + parseFloat(calculated.insurance_per_day.toFixed(2)) + parseFloat(calculated.fuel_per_day.toFixed(2)) + parseFloat(calculated.reg_per_day.toFixed(2)) + parseFloat(calculated.permit_per_day.toFixed(2)) + parseFloat(calculated.maintenance_per_day.toFixed(2))
  let total = Object.keys(calculated).reduce(
    (sum, key) => sum + parseFloat(calculated[key] || 0),
    0
  );
  return (total / (res.data.average_hours || 1)).toFixed(2);
}

export function supplyCalculation(data) {
  let res = {
    data,
  };
  if (!res.data) {
    return 0;
  }
  let calculated = {
    per_day_dpr: (
      res.data.purchase_price /
      res.data.estimate_life /
      res.data.estimated_days || 0
    ).toFixed(2),
    insurance_per_day: (
      res.data.estimated_days / res.data.annual_premium
    ).toFixed(2),
    // fuel_per_day: (
    //   res.data.annual_premium / res.data.average_gallon || 0
    // ).toFixed(2),
    reg_per_day: (
      res.data.annual_registration_fee / res.data.estimated_days || 0
    ).toFixed(2),
    permit_per_day: (
      res.data.annual_permit_fee / res.data.estimated_days || 0
    ).toFixed(2),
    maintenance_per_day: (
      res.data.maintenance_per_year / res.data.estimated_days || 0
    ).toFixed(2),
  };
  let total = Object.keys(calculated)
    .reduce(
      (sum, key) =>
        sum + parseFloat(calculated[key] == Infinity ? 0 : calculated[key]),
      0
    )
    .toFixed(2);
  return total;
}

export function supplyTotalCostCalculation(data) {
  let res = {
    data,
  };
  if (!res.data) {
    return 0;
  }
  let calculated = {
    per_day_dpr: (
      res.data.purchase_price /
      res.data.estimate_life /
      res.data.estimated_days || 0
    ).toFixed(2),
    insurance_per_day: (
      res.data.annual_premium / res.data.estimated_days || 0
    ).toFixed(2),
    // fuel_per_day: ((res.data.annual_premium / res.data.average_gallon) || 0).toFixed(2),
    reg_per_day: (
      res.data.annual_registration_fee / res.data.estimated_days || 0
    ).toFixed(2),
    permit_per_day: (
      res.data.annual_permit_fee / res.data.estimated_days || 0
    ).toFixed(2),
    maintenance_per_day: (
      res.data.maintenance_per_year / res.data.estimated_days || 0
    ).toFixed(2),
    other_cost_per_day: (
      res.data.other_cost_per_year / res.data.estimated_days || 0
    ).toFixed(2),
  };

  let total = Object.keys(calculated)
    .reduce((sum, key) => sum + parseFloat(calculated[key] || 0), 0)
    .toFixed(2);
  return total;
}

export function laborCalculations(data, time, name) {
  // console.log("fdsfdf")
  // console.log(data[0]?.table_data, time, name);
  if (data?.table_data?.length === 0) {
    return 0;
  }
  // let i =
  // data &&
  // data[0] &&

  let i = data?.table_data?.find((item) => {
    // console.log(item, name, "jhdfd")
    return item.wage_type === name;
  });
  // console.log(time, "time")
  // console.log(i, "newData")
  if (!i) {
    return 0;
  }
  if (time === "straight_time") {
    // console.log("hjdgf")
    return (
      parseFloat(i.straight_time_health) +
      parseFloat(i.straight_time_benefits) +
      parseFloat(
        getPercentedValue(0.8, i.straight_time_multiplier * i.base_rate)
      ) +
      parseFloat(
        getPercentedValue(7.65, i.straight_time_multiplier * i.base_rate)
      ) +
      parseFloat(
        getPercentedValue(7, i.straight_time_multiplier * i.base_rate)
      ) +
      parseFloat(i.straight_time_multiplier * i.base_rate) || 0
    ).toFixed(2);
  } else if (time === "over_time") {
    return (
      parseFloat(i.over_time_health) +
      parseFloat(i.over_time_benefits) +
      parseFloat(
        getPercentedValue(0.8, i.over_time_multiplier * i.base_rate)
      ) +
      parseFloat(
        getPercentedValue(7.65, i.over_time_multiplier * i.base_rate)
      ) +
      parseFloat(getPercentedValue(7, i.over_time_multiplier * i.base_rate)) +
      parseFloat(i.over_time_multiplier * i.base_rate) || 0
    ).toFixed(2);
  } else if (time === "off_shift") {
    return (
      parseFloat(i.off_shift_health) +
      parseFloat(i.off_shift_benefits) +
      parseFloat(
        getPercentedValue(0.8, i.off_shift_multiplier * i.base_rate)
      ) +
      parseFloat(
        getPercentedValue(7.65, i.off_shift_multiplier * i.base_rate)
      ) +
      parseFloat(getPercentedValue(7, i.off_shift_multiplier * i.base_rate)) +
      parseFloat(i.off_shift_multiplier * i.base_rate) || 0
    ).toFixed(2);
  } else if (time === "double_time") {
    return (
      parseFloat(i.double_time_health) +
      parseFloat(i.double_time_benefits) +
      parseFloat(
        getPercentedValue(0.8, i.double_time_multiplier * i.base_rate)
      ) +
      parseFloat(
        getPercentedValue(7.65, i.double_time_multiplier * i.base_rate)
      ) +
      parseFloat(
        getPercentedValue(7, i.double_time_multiplier * i.base_rate)
      ) +
      parseFloat(i.double_time_multiplier * i.base_rate) || 0
    ).toFixed(2);
  } else if (time === "night_time") {
    return (
      parseFloat(i.night_time_health) +
      parseFloat(i.night_time_benefits) +
      parseFloat(
        getPercentedValue(0.8, i.night_time_multiplier * i.base_rate)
      ) +
      parseFloat(
        getPercentedValue(7.65, i.night_time_multiplier * i.base_rate)
      ) +
      parseFloat(
        getPercentedValue(7, i.night_time_multiplier * i.base_rate)
      ) +
      parseFloat(i.night_time_multiplier * i.base_rate) || 0
    ).toFixed(2);
  } else {
    return 0.0;
  }
  // let i = {}
  // let obj = {
  //     straight_time_total: ((parseFloat(i.straight_time_health) + parseFloat(i.straight_time_benefits) + parseFloat(getPercentedValue(0.8, i.straight_time_multiplier * i.base_rate)) + parseFloat(getPercentedValue(7.65, i.straight_time_multiplier * i.base_rate)) + parseFloat(getPercentedValue(7, i.straight_time_multiplier * i.base_rate)) + parseFloat((i.straight_time_multiplier * i.base_rate)) || 0)).toFixed(2),
  //     over_time_total: ((parseFloat(i.over_time_health) + parseFloat(i.over_time_benefits) + parseFloat(getPercentedValue(0.8, i.over_time_multiplier * i.base_rate)) + parseFloat(getPercentedValue(7.65, i.over_time_multiplier * i.base_rate)) + parseFloat(getPercentedValue(7, i.over_time_multiplier * i.base_rate)) + parseFloat((i.over_time_multiplier * i.base_rate)) || 0)).toFixed(2),
  //     double_time_total: ((parseFloat(i.double_time_health) + parseFloat(i.double_time_benefits) + parseFloat(getPercentedValue(0.8, i.double_time_multiplier * i.base_rate)) + parseFloat(getPercentedValue(7.65, i.double_time_multiplier * i.base_rate)) + parseFloat(getPercentedValue(7, i.double_time_multiplier * i.base_rate)) + parseFloat((i.double_time_multiplier * i.base_rate)) || 0)).toFixed(2),
  //     off_shift_total: (parseFloat(i.off_shift_health) + parseFloat(i.off_shift_benefits) + parseFloat(getPercentedValue(0.8, i.off_shift_multiplier * i.base_rate)) + parseFloat(getPercentedValue(7.65, i.off_shift_multiplier * i.base_rate)) + parseFloat(getPercentedValue(7, i.off_shift_multiplier * i.base_rate)) + parseFloat((i.off_shift_multiplier * i.base_rate)) || 0).toFixed(2),
  //     night_time_off_shift_total: (parseFloat(i.night_time_off_shift_health) + parseFloat(i.night_time_off_shift_benefits) + parseFloat(getPercentedValue(0.8, i.night_time_off_shift_multiplier * i.base_rate)) + parseFloat(getPercentedValue(7.65, i.night_time_off_shift_multiplier * i.base_rate)) + parseFloat(getPercentedValue(7, i.night_time_off_shift_multiplier * i.base_rate)) + parseFloat((i.night_time_off_shift_multiplier * i.base_rate)) || 0).toFixed(2)
  // }
  // return obj
}

export function calculatePercentage(value, percent) {
  let num = parseFloat(value) || 0;
  let per = (parseFloat(percent) || 0) / 100;
  let result = num + num * per;
  return result.toFixed(2);
}

export function getTabValue() {
  const params = new URLSearchParams(window.location.search);
  switch (params.get("tab")) {
    case "packages":
      return "1";
    case "groups":
      return "2";
    case "items":
      return "2";
    case "kits":
      // return "4";
      return "3";
    case "labor":
      return "1";
    case "employee":
      return "2";
    case "tools":
      return "3";
    case "disposals":
      return "2";
    case "vehicles":
      return "3";
    default:
      return "1";
  }
}

export const TYPES = {
  subtier: {
    name: "subtier",
    icon: Images.new_sub_tier_icon,
    title: "Subtier",
  },
  vehicle: {
    name: "vehicle",
    icon: Images.truck_icon_green,
    title: "Vehicle Group",
  },
  supply: {
    name: "supply",
    icon: Images.supply_sub_tier_icon,
    title: "Supply Sub-tier",
  },
  inventory: {
    name: "inventory",
    icon: Images.inventory_sub_tier_icon,
    title: "Inventory Group",
  },
  inventory_kit: {
    name: "inventory_kit",
    icon: Images.inventory_kit_sub_tier_icon,
    title: "Inventory Kit",
  },
  fleet_kit: {
    name: "fleet_kit",
    icon: Images.double_truck,
    title: "Fleet Kit"
  },
  labor: {
    name: "labor",
    icon: Images.labor_sub_tier_icon,
    title: "Labor",
  },
  parent: {
    name: "top_tier",
    icon: Images.line_package,
    title: "Top Tier",
  },
  disposal: {
    name: "Disposal",
    icon: Images.disposal,
    title: "Disposal",
  },
};

export const SUPPLY = "SUPPLY";
export const LABOR = "LABOR";

export const SERVICE_TIER = "SERVICE_TIER";
export const SERVICE_LINE_ITEM = "SERVICE_LINE_ITEM";

// for create input field
export const TREE_INPUT_FIELD = "TREE_INPUT_FIELD";

export const FLEET_TIER = "FLEET_TIER";
export const FLEET_GROUP = "FLEET_GROUP";

export const SUPPLY_TIER = "SUPPLY_TIER";
export const SUPPLY_GROUP = "SUPPLY_GROUP";
 
export const INVENTORY_TIER = "INVENTORY_TIER";
export const INVENTORY_GROUP = "INVENTORY_ITEM";

export const DISPOSAL_TIER = "DISPOSAL_TIER";
export const DISPOSAL = "DISPOSAL";

export const MANAGEMENT_TREE_TYPES = {
  SERVICE_TIER: {
    name: "Tier",
    icon: "",
  },
  SERVICE_LINE_ITEM: {
    name: "Service",
    icon: "",
  },
  FLEET_TIER: {
    name: "Fleet Tier",
    icon: "",
  },
  FLEET_GROUP: {
    name: "Fleet Group",
    icon: "",
  },
  SUPPLY_TIER: {
    name: "Supply Tier",
    icon: "",
  },
  SUPPLY_GROUP: {
    name: "Supply Group",
    icon: "",
  },
  INVENTORY_TIER: {
    name: "Inventory Tier",
    icon: "",
  },
  INVENTORY_ITEM: {
    name: "Inventory Group",
    icon: "",
  },
  DISPOSAL_TIER: {
    name: "Disposal Tier",
    icon: "",
  },
  DISPOSAL: {
    name: "Disposal",
    icon: "",
  },
  TREE_INPUT_FIELD: {
    name: "Input Field",
    icon: "",
  },
};

export const SERVICE_RESOURCES = {
  LABOR: {
    name: "Labor",
    key: "LABOR",
    server_key: "LABOR",
    icon: Images.labor_sub_tier_icon,
  },
  FLEET: {
    key: "FLEET",
    server_key: "FLEET_GROUP",
    name: "Fleet Group",
    icon: Images.truck_icon_green,
  },
  FLEET_KIT: {
    key: "FLEET_KIT",
    server_key: "FLEET_KIT",
    name: "Fleet Kit",
    icon: Images.double_truck,
  },
  SUPPLY: {
    key: "SUPPLY",
    server_key: "SUPPLY_GROUP",
    name: "Supply Group",
    icon: Images.supply_sub_tier_icon,
  },
  INVENTORY: {
    key: "INVENTORY",
    server_key: "INVENTORY_ITEM",
    name: "Inventory Item",
    icon: Images.inventory_sub_tier_icon,
  },
  INVENTORY_KIT: {
    key: "INVENTORY_KIT",
    server_key: "INVENTORY_KIT",
    name: "Inventory Kit",
    icon: Images.inventory_kit_sub_tier_icon,
  },
  DISPOSAL: {
    key: "DISPOSAL",
    server_key: "DISPOSAL",
    name: "Disposal",
    icon: Images.disposal,
  },
};

export const checkActiveKey = (url) => {
  if (url.includes("account") || url.includes("contacts")) {
    return 1;
  } else if (url.includes("sales") || url.includes("opportunities")) {
    return 2;
  } else if (
    url.includes("service") ||
    url.includes("labor") ||
    url.includes("fleet") ||
    url.includes("inventory") ||
    url.includes("supply-tools") ||
    url.includes("disposal")
  ) {
    return 4;
  }
};

export const checkDisposalFieldsRequired = (data) => {
  if (
    // data.margin &&
    data.name &&
    // data.unit_cost &&
    // data.uom &&
    data.uom_array &&
    data.internal_location &&
    // disposal_uom
    data.disposal_family
  ) {
    return false;
  }
  return true;
};

export const checkProposalFieldsRequired = (data) => {
  if (
    data?.name && data?.proposal_recipient &&
    data?.owner_contact && data?.point_proposal && data?.status && (data?.service_variant_count != 0)
  ) {
    return false;
  }
  return true;
}


export const checkProjectFieldsRequired = (data) => {
  if (
    data?.name && data?.project_recipient &&
    data?.project_owner_contact && data?.status
  ) {
    return false;
  }
  return true;
}

export const checkOpportunityFieldsRequired = (data) => {
  let ownerContact = data.owner_contact_accounts?.length || data.owner_contact_accounts;
  let customerContact = data.customer_contact_accounts?.length || data.customer_contact_accounts
  if (
    data?.name && data?.status && data?.source
    && ownerContact > 0
    && customerContact > 0
  ) {
    return false;
  }
  return true;
}

export const checkFleetFieldsRequired = (data) => {
  if (
    data.parent &&
    data.name &&
    data.estimated_days &&
    data.estimated_life.toString() &&
    data.purchase_cost.toString() &&
    data.average_hours.toString() &&
    data.annual_premium &&
    data.average_gallon.toString() &&
    data.average_price &&
    data.annual_permit_fee &&
    data.maintenance_per_year &&
    data.annual_fee
    // disposal_uom
  ) {
    return false;
  }
  return true;
}

export const checkInventoryFieldRequired = (data) => {
  if (
    data.margin &&
    data.name &&
    data.unit_cost &&
    data.uom &&
    data.uom_array &&
    data.internal_location &&
    data.inventory_family
  ) {
    return false;
  }
  return true;
}

export const checkLaborFieldRequired = (data) => {
  if (
    data.region &&
    data.labor_group_name &&
    data.union_type &&
    data.table_data?.length
  ) {
    return false;
  }
  return true;
}

export const checkSupplyFieldRequired = (data) => {
  if (
    data.name &&
    data.supply_family &&
    data.estimated_days &&
    data.estimate_life &&
    data.average_hours &&
    data.purchase_price
  ) {
    return false;
  }
  return true;
}
export const formatTwentyDigits = (e) => {
  // console.log(String(e.target.value));
  const valueArr = e.target.value.split("");
  valueArr.splice(3, 0, "-");
  valueArr.splice(7, 0, "-");
  // const newArr = valueArr.join();
  // console.log(newArr, 'final')
  console.log(valueArr.join(), "string");
  return valueArr.join();
};

export const Role = (props) => {
  const role = getUserRole();
  if (!props.isReverse) {
    if (props.allow?.includes(role)) {
      return props.children;
    }
    return null
  }
  if (props.allow.includes(role)) {
    return null;
  }
  return props.children;
};

export function isAccessible(allow = [], isReverse = false) {
  const role = getUserRole();
  if (!isReverse) {
    return !!allow.includes(role);

  }
  return !allow.includes(role);

}

export function isDomainAccessible(allow = [], isReverse= false) {
  const data = window.location.host.split('.')
  if(data.length === 3){
    const subdomain = data[0]
    if (!isReverse) {
      return !!allow.includes(subdomain);
  
    }
    return !allow.includes(subdomain);
  }
  if(data[0].includes('localhost') && _.findIndex(allow, function(o) { return o == 'localhost'; }) > -1){
    return true
  }

  return false
  

}

export function statusLabel(status){
  return status.split("_").map( i => i[0].toUpperCase()+ i.substring(1).toLowerCase()).join(' ')
}

export const debounceEvent = (func, wait, immediate) => {
  let timeout;

  return function executedFunction() {
    let context = this;
    let args = arguments;

    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    let callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

export const checkAccountRequired = (account, type) => {
  if (type) {
    if (type === 'ADDRESS') {
      if (account?.main_address?.street_address &&
        account.main_address?.city &&
        account.main_address?.state &&
        account.main_address?.zip_code &&
        account.billing_address?.state) {
        return false;
      }
      else {
        return true
      }
    } else if (type === 'PAYMENT') {
      if (account?.payment_information?.default_sales_tax || (typeof (account?.payment_information?.tax_exemption) == 'boolean')) {
        return false;
      }
      else {
        return true;
      }
    } else if (type === "SITES") {
      if (account?.sites?.length) {
        return false;
      }
      else {
        return true;
      }
    } else if (type === "CONTACT") {
      if (account?.id && account.default_email && account.default_phone) {
        return false;
      }
      else {
        return true;
      }

    } else if (type === 'CONTACT_ADDRESS') {
      if (account?.city && account?.street_address && account?.state && account?.zip_code) {
        return false;
      }
      else {
        return true;
      }
    } else if(type === "CUSTOMEROWNER_PAYMENT") {
       if(account?.credit_limit && account?.duns_number && account?.payment_term && account?.credit_rating && account?.default_sales_tax) {
         return false;
       } else {
         return true;
       }
    }
  } else {
    return false;

  }
}

export const checkOpportunityRequired = (data, type) => {
  let complete = true;
  if (type === 'CUSTOMER') {
    if (data?.customer_contact_accounts) {
      data.customer_contact_accounts.forEach((i) => {
        if (i?.account && i?.contact?.length) {
          complete = false
        }
      })
    }
  } else if (type === 'OWNER') {
    if (data?.owner_contact_accounts?.length) {
          complete = false
        }
  } else if (type === 'TEAMS') {
    if (data?.sales_assistant?.length || data?.sales_manager?.length || data?.sales_person?.length) {
      complete = false
    }
  }
  if (complete) return true;
  return false;
}

export const checkProposalRequired = (data, type) => {
  let complete = true;
  if (type === 'CUSTOMER') {
    if (data?.customer_contact) {
      data.customer_contact.forEach((i) => {
        if (i?.account && i?.contact?.length) {
          complete = false
        }
      })
    }
  } else if (type === 'OWNER') {
    if (data?.owner_contact?.length) {
          complete = false
    }
  } else if (type === 'TEAMS') {
    if (data?.sales_assistant?.length || data?.sales_manager?.length || data?.sales_person?.length) {
      complete = false
    }
  } else if (type === 'SERVICE_VARIENT') {
    if (data?.service_variant_count !== 0) {
      complete = false
    }
  }

  if (complete) return true;
  return false;
}

export const checkProjectRequired = (data, type) => {
  let complete = true;
  if (type === 'CUSTOMER') {
    if (data?.project_customer_contact) {
      data.project_customer_contact.forEach((i) => {
        if (i?.account && i?.contact?.length) {
          complete = false
        }
      })
    }
  } else if (type === 'OWNER') {
    if (data?.project_owner_contact?.length) {
          complete = false
    }
  } else if (type === 'TEAMS') {
    if (data?.sales_assistant?.length || data?.sales_manager?.length || data?.sales_person?.length) {
      complete = false
    }
  } else if (type === 'SERVICE_VARIENT') {
    if (data?.service_variant_count !== 0) {
      complete = false
    }
  }

  if (complete) return true;
  return false;
}

export const checkWorkOrderRequired = (data, type) => {
  let complete = true;
  if (type === 'CUSTOMER') {
    if (data?.work_customer_contact) {
      data.work_customer_contact.forEach((i) => {
        if (i?.account && i?.contact?.length) {
          complete = false
        }
      })
    }
  } else if (type === 'OWNER') {
    if (data?.work_owner_contact) {
      data.work_owner_contact.forEach((i) => {
        if (i?.account && i?.site?.length) {
          complete = false
        }
      })
    }
  } else if (type === 'WAREHOUSE') {
    if (data?.workorder_warehouse?.length) {
      complete = false
    }
  } else if (type === 'SERVICE_VARIENT') {
    if (data?.workorder_variant?.length) {
      complete = false
    }
  } else if (type === 'SERVICE_INFO') {
    if (data?.service_date && data?.start_time) {
      complete = false
    }
  }

  if (complete) return true;
  return false;
}