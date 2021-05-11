$(function(){
    function changeIframeUrl(url)

{

    document.getElementById("main_frame").src = url;

}

let display_arr=[
    'Daily-Report.html',
    "Weekly-Report.html",
    "Monthly-Report.html",
    "Equip-Report.html"
]


display_arr=sessionStorage.getItem('monit').split(',')

let display_set=sessionStorage.getItem('set').split(',')


let result_arr=[]

display_arr.forEach(function(item,index){
    result_arr.push({addr:item,sec:display_set[index]})
})
console.log('display_arr',result_arr)
//console.log(Erypto.decrypt(getParam('user')) )
//~$('#main_frame').attr('src', 'Daily-Report.html')

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const wrapSlept = async () => { await sleep(2000) };

function test() {
    const promiseFunction = (sec) =>
    
        new Promise((resolve) => setTimeout(() => resolve(), sec*1000));

    let array = Array(10).fill(0);
  	// (1) test를 async로 감싸는 대신, for문을 async 즉시실행함수로 감싸도 된다
    (async () => {
      	// (2) forEach 대신 for ... of를 사용한다
        for (let element of result_arr) {
            $('#main_frame').attr('src', element.addr)
            const result = await promiseFunction(element.sec);
            console.log(result);
        }
        location.reload();
    })();
}

test()
//load()



async function load(){
 while(true) {
            await test()
 
        }
}


function getParam(sname) {

    var params = location.search.substr(location.search.indexOf("?") + 1);

    var sval = "";

    params = params.split("&");

    for (var i = 0; i < params.length; i++) {

        temp = params[i].split("=");

        if ([temp[0]] == sname) { sval = temp[1]; }

    }

    return sval;

}

//   (async () => {
//       	// (2) forEach 대신 for ... of를 사용한다
       
        
//     })();






// async function processArray(array) {
//   for (const item of array) {
//     await delayedLog(item);
//   }
//   console.log('Done!');
// }


//     async function processArray(array) {
//         array.forEach(async (item) => {
//             await delayedLog(item);
//         })
//   console.log('Done!');
// }
// while(true){
//     display_arr.forEach(function(item,index,arr2){ 
//                     console.log(item,index);
//                     //$('#my_frame').attr('src', url);

//     })
// }



})