export default function convertToArrayOfObjects(data: [[]]): any[] {
  let keys = data.shift();
  let i = 0;
  let k = 0;
  let obj = null;
  let output = [];

  for (i = 0; i < data.length; i++) {
    obj = {};

    for (k = 0; k < keys.length; k++) {
      if (!data[i][k]) {
        obj[keys[k]] = false;
      } else if (data[i][k] === "true") {
        obj[keys[k]] = true;
      } else {
        obj[keys[k]] = data[i][k];
      }
    }

    output.push(obj);
  }

  return output;
}
