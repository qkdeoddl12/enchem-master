$(function(){
     

    var chart1 = c3.generate({
        bindto: '#chart1',
        data: {
            x:'date',
            columns: [
			['date', '2021-03-01', '2021-03-02', '2021-03-03', '2021-03-04', '2021-03-05', '2021-03-05']
			,['생산량', 1233, 243, 364, 675, 736,465],['생산량1', 113, 243, 364, 675, 736,465]
		]
        }
        ,axis : {
        x : {
                type : 'timeseries',
                tick: {
                        format: '%m-%d'
                }
            }
        }
    
    });

var chart2 = c3.generate({
        bindto: '#chart2',
        data: {
            x:'date',
            columns: [
			['date', '2021-01-01', '2021-02-02', '2021-03-03', '2021-04-04', '2021-05-05', '2021-06-05']
			,['생산량', 1233, 243, 364, 675, 736,123]
		]
        }
        ,axis : {
        x : {
                type : 'timeseries',
                tick: {
                        format: '%m'
                }
            }
        }
    
    });
    var chart_prod = c3.generate({
                bindto: '#chart_prod',
                size: {
                    height: 250
                },
                bar: {
                    width: 40
                },
                padding: {
                    left: 60
                },
                color: {
                    pattern: ['#49D6DE', '#DEC849']
                },
                data: {
                    x: 'x',
                    columns:
                        [
                      ['x', '전일', '금일'],
                      ['생산량', 300, 400]
                      ],

                    type: 'bar'
                   ,
                    color: function(inColor, data) {
                        var colors = ['#49D6DE', '#DEC849'];
                        if(data.index !== undefined) {
                            return colors[data.index];
                        }

                        return inColor;
                    }
                },
                axis: {
                    rotated: false,
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




            var chart_wash_oper = c3.generate({
                bindto: '#chart_wash_oper',
                size: {
                    height: 250
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
                      ['Min', 300, 400]
                      ],

                    type: 'bar'
                   ,
                    color: function(inColor, data) {
                        var colors = ['#49D6DE', '#DEC849'];
                        if(data.index !== undefined) {
                            return colors[data.index];
                        }

                        return inColor;
                    }
                },
                axis: {
                    rotated: false,
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


             var chart_wash_loss = c3.generate({
                bindto: '#chart_wash_loss',
                size: {
                    height: 250
                },
                bar: {
                    width: 40
                },
                padding: {
                    left: 60
                },
                color: {
                    pattern: ['#49D6DE', '#DEC849']
                },
                data: {
                    x: 'x',
                    columns:
                        [
                      ['x', '전일', '금일'],
                      ['불량수량', 300, 400]
                      ],

                    type: 'bar'
                   ,
                    color: function(inColor, data) {
                        var colors = ['#49D6DE', '#DEC849'];
                        if(data.index !== undefined) {
                            return colors[data.index];
                        }

                        return inColor;
                    }
                },
                axis: {
                    rotated: false,
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



    function getDataData(){
        $.ajax({
            url: BOARD_IP+"/getDailyEquipdata",
            type: "POST",
            dataType: "JSON",
            success: function (data) {

               console.log('getDailyEquipdata',data)

               let equip_data=data.equip[0], man=data.man[0][0].day_worker,summary=data.summary[0]
               

               console.log('equip_data',equip_data,'man',man)


               equip_data.forEach(function(item,index,arr2){ 
                    console.log(item,index);
                    // $(`#plcData_status_${index+1}`).val(i)
                    $(`#plcData_workTime_${index+1}`).text(item.workTime)
                    $(`#plcData_realTIme_${index+1}`).text(item.realTIme)

                })

                $("#plcData_work_sum").text(summary[0].workTime)
                $("#plcData_real_sum").text(summary[0].realTime)

                $("#plcData_work_sum2").text(summary[1].workTime)
                $("#plcData_real_sum2").text(summary[1].realTime)




               

            //    day1_cnt=data.data[0].cnt//금일
            //    day1_loss=data.data[0].loss//금일
            //    day2_cnt=data.data[1].cnt//전일

            //    let day_diff_per=Math.round(day1_cnt/day2_cnt*100)

            //    if(day_diff_per>100){
            //     $('svg.radial-progress circle').css('stroke','rgb(230 33 33)')
            //        $(".complete").css('stroke-dashoffset','0px')
            //    }else if(day_diff_per<100&&day_diff_per>0){
            //     let chart_val=(100-day_diff_per)*2.2
            //     $('svg.radial-progress circle').css('stroke','rgb(83, 218, 241)')
            //     $(".complete").css('stroke-dashoffset',chart_val+'px')
            //     }else{
            //         $('svg.radial-progress circle').css('stroke','rgb(83, 218, 241)')
            //         $(".complete").css('stroke-dashoffset','220px')
            //     }

            //     $("#day2_cnt").text(`${day2_cnt}`)
            //     $("#day1_cnt").text(`${day1_cnt}`)

            //     $("#2ndCln_out").text(day1_cnt)
            //     $("#2ndCln_loss").text(day1_loss)
            //     $("#2ndCln_loss_per").text( Math.round(day1_loss/day1_cnt*100)+'%' )
            //     $("#UPH_val").text(Math.round(day1_cnt/8).toFixed(1) )
            //     /* 
            //     svg.radial-progress circle {
            //         fill: rgba(0,0,0,0);
            //         stroke: rgb(83, 218, 241);
            //         stroke-dashoffset: 219.91148575129; 
            //         stroke-width: 10;
            //         }
            //      */
                
            //    chart.load({
            //     columns:  [
            //         ['x', '전월', '금월'],
            //         ['생산량', day2_cnt, day1_cnt]
            //         ]
            //   });

            //   $(".percentage").text('')
            //   $(".percentage").text(Math.round(day1_cnt/day2_cnt*100)+'%')


                
               
            },
            error:function (error) {

            }
        });



         $.ajax({
            url: BOARD_IP+"/getMonthlyEquipdata",
            type: "POST",
            dataType: "JSON",
            success: function (data) {

               console.log('getMonthlyEquipdata',data)

               let equip_data=data.equip[0], man=data.man[0][0].day_worker,summary=data.summary[0]
               

               console.log('equip_data',equip_data,'man',man)


               equip_data.forEach(function(item,index,arr2){ 
                    console.log(item,index);
                    // $(`#plcData_status_${index+1}`).val(i)
                    $(`#plcData_workTime_${index+1}_mon`).text(item.workTime)
                    $(`#plcData_realTIme_${index+1}_mon`).text(item.realTIme)

                })

                $("#plcData_work_sum_mon").text(summary[0].workTime)
                $("#plcData_real_sum_mon").text(summary[0].realTime)

                $("#plcData_work_sum2_mon").text(summary[1].workTime)
                $("#plcData_real_sum2_mon").text(summary[1].realTime)




               

            //    day1_cnt=data.data[0].cnt//금일
            //    day1_loss=data.data[0].loss//금일
            //    day2_cnt=data.data[1].cnt//전일

            //    let day_diff_per=Math.round(day1_cnt/day2_cnt*100)

            //    if(day_diff_per>100){
            //     $('svg.radial-progress circle').css('stroke','rgb(230 33 33)')
            //        $(".complete").css('stroke-dashoffset','0px')
            //    }else if(day_diff_per<100&&day_diff_per>0){
            //     let chart_val=(100-day_diff_per)*2.2
            //     $('svg.radial-progress circle').css('stroke','rgb(83, 218, 241)')
            //     $(".complete").css('stroke-dashoffset',chart_val+'px')
            //     }else{
            //         $('svg.radial-progress circle').css('stroke','rgb(83, 218, 241)')
            //         $(".complete").css('stroke-dashoffset','220px')
            //     }

            //     $("#day2_cnt").text(`${day2_cnt}`)
            //     $("#day1_cnt").text(`${day1_cnt}`)

            //     $("#2ndCln_out").text(day1_cnt)
            //     $("#2ndCln_loss").text(day1_loss)
            //     $("#2ndCln_loss_per").text( Math.round(day1_loss/day1_cnt*100)+'%' )
            //     $("#UPH_val").text(Math.round(day1_cnt/8).toFixed(1) )
            //     /* 
            //     svg.radial-progress circle {
            //         fill: rgba(0,0,0,0);
            //         stroke: rgb(83, 218, 241);
            //         stroke-dashoffset: 219.91148575129; 
            //         stroke-width: 10;
            //         }
            //      */
                
            //    chart.load({
            //     columns:  [
            //         ['x', '전월', '금월'],
            //         ['생산량', day2_cnt, day1_cnt]
            //         ]
            //   });

            //   $(".percentage").text('')
            //   $(".percentage").text(Math.round(day1_cnt/day2_cnt*100)+'%')


                
               
            },
            error:function (error) {

            }
        });


    }




});


