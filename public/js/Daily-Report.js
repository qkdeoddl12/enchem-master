$(function(){
    

    let day1_cnt=0,day1_loss=0,day2_cnt=0;

    var chart = c3.generate({
        bindto: '#uv-div',
        size: {
            height: 150
        },
        bar: {
            width: 40
        },
        padding: {
            left: 60
        },
        color: {
            pattern: ['#FABF62', '#ACB6DD']
        },
        data: {
            x: 'x',
            columns:
                [
              ['x', '전일', '금일'],
              ['생산량', day2_cnt, day1_cnt]
              ],

            type: 'bar'
           ,
            color: function(inColor, data) {
                var colors = ['#FABF62', '#ACB6DD'];
                if(data.index !== undefined) {
                    return colors[data.index];
                }

                return inColor;
            }
        },
        axis: {
            rotated: true,
            x: {
                type: 'category'
            },
            y: {
              show: false
            }
        },
        legend: {
            show: false
        }
    });

    getDataData()
    setInterval(function () {
        getDataData()
    },1000)

        setInterval(function () {
        $("#txtCurrentDateTime").text(now)
        
    },1000)




    function getDataData(){
        $.ajax({
            url: BOARD_IP+"/getDaydata",
            type: "POST",
            dataType: "JSON",
            success: function (data) {

               console.log('getDaydata',data.data)

               day1_cnt=data.data[0].cnt//금일
               day1_loss=data.data[0].loss//금일
               day2_cnt=data.data[1].cnt//전일
               day2_in=data.data[1].in_cnt//전일

               let day_diff_per=Math.round(day1_cnt/day2_cnt*100)

               if(day_diff_per>100){
                $('svg.radial-progress circle').css('stroke','rgb(230 33 33)')
                   $(".complete").css('stroke-dashoffset','0px')
               }else if(day_diff_per<100&&day_diff_per>0){
                let chart_val=(100-day_diff_per)*2.2
                $('svg.radial-progress circle').css('stroke','rgb(83, 218, 241)')
                $(".complete").css('stroke-dashoffset',chart_val+'px')
                }else{
                    $('svg.radial-progress circle').css('stroke','rgb(83, 218, 241)')
                    $(".complete").css('stroke-dashoffset','220px')
                }

                $("#day2_cnt").html(`${day2_cnt} / 0   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 총 생산량 : ${day2_cnt}`)
                $("#day1_cnt").html(`${day1_cnt} / 0   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 총 생산량 : ${day1_cnt}`)

                $("#2ndCln_in").text(day2_in)
                $("#2ndCln_out").text(day1_cnt)
                $("#2ndCln_loss").text(day1_loss)
                $("#2ndCln_loss_per").text( Math.round(day1_loss/day1_cnt*100)+'%' )
                $("#UPH_val").text(Math.round(day1_cnt/8).toFixed(1) )
                /* 
                svg.radial-progress circle {
                    fill: rgba(0,0,0,0);
                    stroke: rgb(83, 218, 241);
                    stroke-dashoffset: 219.91148575129; 
                    stroke-width: 10;
                    }
                 */
                
               chart.load({
                columns:  [
                    ['x', '전월', '금월'],
                    ['생산량', day2_cnt, day1_cnt]
                    ]
              });

              $(".percentage").text('')
              $(".percentage").text(Math.round(day1_cnt/day2_cnt*100)+'%')


                
               
            },
            error:function (error) {

            }
        });



        $.ajax({
            url: BOARD_IP+"/getDayPlcdata",
            type: "POST",
            dataType: "JSON",
            success: function (data) {

               console.log('getDayPlcdata',data.data)
                $("#plcData_1").text(data.data[0].cnt)
                $("#plcData_2").text(data.data[1].cnt)
                $("#plcData_3").text(data.data[2].cnt)
                $("#plcData_4").text(data.data[3].cnt)
                $("#plcData_5").text(data.data[4].cnt)

                $("#plc_total1").text(data.data[0].cnt+data.data[1].cnt+data.data[2].cnt)
                $("#plc_total2").text(data.data[3].cnt+data.data[4].cnt)
               
               
            },
            error:function (error) {

            }
        });


        $.ajax({
            url: BOARD_IP+"/getDailyDate",
            type: "POST",
            dataType: "JSON",
            success: function (data) {

               console.log('getDailyDate',data.data[0].date_data)
               $("#txtCurrentDate").text(data.data[0].date_data)
               $("#txtDailyWorkMan").text(`주간 : ${data.data[0].day_worker}명 야간 : ${data.data[0].night_worker}명`)
             
               
               
            },
            error:function (error) {

            }
        });

         
    }



    




    




});


