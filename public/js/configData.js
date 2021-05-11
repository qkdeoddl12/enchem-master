const STATUS=[
        {CODE:'I',NAME:'입고'},
      
        {CODE:'O',NAME:'출고'},
        {CODE:'D',NAME:'삭제'}
    ]


    const LOSS_DATA=[
        {CODE:'T',NAME:'불량'},
        {CODE:'F',NAME:'정상'}
    ]



const MAIN_IP='http://127.0.0.1:3030'

const BOARD_IP='http://127.0.0.1:3050'


//const MAIN_IP='http://192.168.21.9:3030'

//const BOARD_IP='http://192.168.21.9:3050'


    var now = function() {
    var date = new Date();
    var m = date.getMonth()+1;
    var d = date.getDate();
    var h = date.getHours();
    var i = date.getMinutes();
    var s = date.getSeconds();
    var get_date = date.getFullYear()+'-'+(m>9?m:'0'+m)+'-'+(d>9?d:'0'+d)+' '+(h>9?h:'0'+h)+':'+(i>9?i:'0'+i)+':'+(s>9?s:'0'+s);

    return get_date;
}

