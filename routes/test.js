var carNo = '京A12345';
console.log(carNo.indexOf('-'));
if (carNo.indexOf('-') < 0) {
    carNo = carNo.substring(0, 1) + '-' + carNo.substring(1);
}
console.log('carNo', carNo);