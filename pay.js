var startTime = 1642608000000
var endTime = Date.parse(new Date())
var token = 'ff0bf1e3-d004-4846-9b58-6044c8577942'


function checkPaid() {
  return fetch('https://pay-mmc.payermax.com/pay-mmc-web/payment/singleDetailQueryList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      merchantid: 'SP22960344',
      token,
    },
    body: JSON.stringify({
      'pageNum': 1,
      'pageSize': 1000,
      'orderId': '',
      'detailStatus': 2, //付款状态
      'startTime': startTime,
      'endTime': endTime,
      'payerCountry': 'ID',
      'payType': '',
      'companyEntity': '',
      'merchantId': 'SP22960344'
    }),
  }).then(response => response.json())
}

async function main () {
  const res = await checkPaid()
  if (res.code === '200') {
    if (res.data.actualTotal<=0) {
      console.log('无搜索结果');
      alert('无搜索结果！');
      return
    }

    var accountObj = {}
    res.data.rows.forEach(item => {
      if (!accountObj[item.payAmount]) {
        accountObj[item.payAmount] = []
      }
      accountObj[item.payAmount].push(item.payeeAccountNo)
    })
    for (const [key,value] of Object.entries(accountObj)) {
      console.log(`payAmount为${key}:`,value);
    }
  } else {
    console.log('读取失败！');
    alert('读取失败！');
  }
}
main()
