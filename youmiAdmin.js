var accounts = []
var start_date = 0
var end_date = 0
var itemTitle = ''
if(!itemTitle || !accounts.length || !start_date|| !end_date){
  alert('脚本必填项未填！')
}
/*
  3000:133,
  10000:69,
  5000:125,
  7000:124,
  8000:123,
  6000:122,
 */
var itemTitleObj = {
  3000:133,
  10000:69,
  5000:125,
  7000:124,
  8000:123,
  6000:122,
}

var rejectApi =  location.origin + '/api/exchange/record_status'
var rejectReason
/*根据域名请求不同接口*/
if (location.origin.includes('manage-admin')) {
  rejectReason =  "Mohon maaf, kami telah membayar untuk nomor ini tetapi gagal, silakan redeem lagi ke platform lain yang terdaftar pakai nomor akun jadiduit misalnya OVO, GOPAY,ShopeePay dan Linkaja.  Atau Anda dapat menghubungi kami melalui Facebook (jadiduit_indonesia) untuk ganti nomor, terima kasih banyak."
} else if (location.origin.includes('cariduit-admin')){
  rejectReason =  "Mohon maaf, kami telah membayar untuk nomor ini tetapi gagal, silakan redeem lagi ke platform lain yang terdaftar pakai nomor akun jadiduit misalnya OVO, GOPAY,ShopeePay dan Linkaja.  Atau Anda dapat menghubungi kami melalui Facebook (jadiduit_indonesia) untuk ganti nomor, terima kasih banyak."
}

// reject函数
function reject (id){
  return fetch(rejectApi,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      reason: rejectReason,
      status: "3"
    }),
  }).then(response => response.json())
}

// 根据Account查询
function checkAccount (account){
  var checkApi = `${location.origin}/api/exchange/record_list?category=1&app_type=1&user_detect=normal_user&account=${account}&item_id=${itemTitle}&start_date=${start_date}&end_date=${end_date}&status=1&time_offset=7&paging.page=1&paging.per_page=50&order.order_by=created_at&order.reverse=0`
  // checkApi = `${location.origin}/api/exchange/record_list?account=${account}&status=1&time_offset=7&paging.page=1&paging.per_page=50&order.order_by=created_at&order.reverse=0`
  return fetch(checkApi)
    .then(response => response.json())
}
//无搜索结果的Account
var emptyList = []
// 主函数
async function main () {
  try {
    while (accounts.length){
      const res = await checkAccount(accounts[0])
      if (res.status.code == 0 && res.list) {
        console.log(res.list);
        if (res.list.length) {
          const rejectRes = await reject(res.list[0].id)
          if (rejectRes.status && rejectRes.status.code == 0) {
            accounts.splice(0, 1)
          } else {
            console.log(`reject ${accounts[0]}出错，脚本已停止。以下Account未执行：${accounts}`)
            alert(`reject ${accounts[0]}出错，脚本已停止`)
            break
          }
        } else {
          if (accounts[0][0] == '0') {
            emptyList.push(accounts[0])
          }
          accounts.splice(0, 1)
        }

        //取出emptyList中的account去掉首位的0后放入accounts重新执行
        if (accounts.length === 0 && emptyList.length) {
          accounts = emptyList.map(item => item.slice(1))
          emptyList = []
        }
      } else {
        console.log(`查询${accounts[0]}出错，脚本已停止。以下Account未执行：${accounts}`)
        alert(`查询${accounts[0]}出错，脚本已停止`)
        break
      }
    }

    if (accounts.length === 0) {
      console.log('脚本已全部执行成功')
      alert('脚本已全部执行成功')
    }

    if (emptyList.length) {
      console.log(`以下Account无搜索结果，但已去除第一个0并重新reject：${emptyList}`)
    }
  }catch(error){
    alert(`接口请求出错，请查看控制台。`)
    console.log(error)
    console.log('剩余以下Account未处理：',accounts);
    console.log('以下Account搜索结果为空：',emptyList);
  }
}
main()
