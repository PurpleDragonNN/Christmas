var startTime = 1643040000000
var endTime = Date.parse(new Date())
var token = '4525dfd3-a739-42bb-af65-49aec1448fc3'


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
      'batchNo': '',
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

    var batchNoObj = {}
    res.data.rows.forEach(item => {
      if (!batchNoObj[item.batchNo]) {
        batchNoObj[item.batchNo] = {}
      }
      var accountObj =  batchNoObj[item.batchNo]
      if (!accountObj[item.payAmount]) {
        accountObj[item.payAmount] = []
      }
      accountObj[item.payAmount].push(item.payeeAccountNo)
    })
    var lastKey = ''
    for (const [key,value] of Object.entries(batchNoObj)) {
      if (lastKey !== key) {
        console.log('')
        console.log(`***************付款批次号为${key}***************`);
        lastKey = key
      }
      for (const [sonKey,sonValue] of Object.entries(value)) {
        console.log(`payAmount为${sonKey}:`,sonValue);
      }

      // console.log('请复制以下内容：'+JSON.stringify(value));

    }
  } else {
    console.log('读取失败！');
    alert('读取失败！');
  }
}
main()
