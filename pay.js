var startTime = 1642435200000
var endTime = 1642607999999
var token = '90dbfdbd-6d2e-4f58-9ef9-a1922e03a325'

// const payAmount = [3000,10000]


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

    const accountArr = []
    res.data.rows.forEach(item => {
      if (item.payAmount === 3000) {
        accountArr.push(item.payeeAccountNo)
      }
    })
    console.log(`共${accountArr.length}条`);
    console.log(`payAmount为3000:`,accountArr);
  } else {
    console.log('读取失败！');
    alert('读取失败！');
  }
}
main()
