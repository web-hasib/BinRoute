const handleInputChange = (value) => {
    let formattedValue = value;

    const digitsOnly = value.replace(/\D/g, "");
    if (digitsOnly.length > 2) {
      formattedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
    } else {
      if (value.endsWith('/') && value.length === 3) {
        formattedValue = digitsOnly + '/';
      } else {
        formattedValue = digitsOnly;
      }
    }
    return formattedValue;
};

let current = "";
const typeKeys = (keys) => {
    for (const key of keys) {
        current += key;
        current = handleInputChange(current);
        console.log(`Typed ${key} -> State: ${current}`);
    }
}
typeKeys("1234");
