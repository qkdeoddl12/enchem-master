

$(function(){

   
    var del_data=[
        {CODE:'Y',NAME:'사용안함'},
        {CODE:'N',NAME:'사용중'}
    ]

    var check_id=false
    let user_mode='I'
    var password_data=""

    var now = function() {
        var date = new Date();
        var m = date.getMonth()+1;
        var d = date.getDate();
        var h = date.getHours();
        var i = date.getMinutes();
        var s = date.getSeconds();
        var get_date = date.getFullYear()+'-'+(m>9?m:'0'+m)+'-'+(d>9?d:'0'+d);
    
        return get_date;
    }
    

    $("#dateStart").datepicker({
        'format': 'yyyy-mm-dd'
    });

    $("#dateEnd").datepicker({
        'format': 'yyyy-mm-dd'
    });
    $("#dateStart").val(now())
    $("#dateEnd").val(now())


    STATUS.forEach(element => 
        $('#txtStatus').append(`<option value='${element.CODE}'>${element.NAME}</option>`)
    );

    LOSS_DATA.forEach(element => 

        $('#txtLoss').append(`<option value='${element.CODE}'>${element.NAME}</option>`)

    );

    // $.ajax({
    //         url: "/login",
    //         type: "POST",
    //         dataType: "JSON",
    //         data: {
    //             id: function () {

    //                 return $("#txtID").val()
    //             },
    //             pw: function () {

    //                 return $("#txtPW").val()
    //             },

    //         },
    //         success: function (data) {
    //             console.log('insertUser',data)
    //             if(data.auth){
    //                  $("#login-div").hide()
    //                 $("#main-div").show()
    //             }
                
    //         },
    //         error:function (error) {

    //         }
    //     });


 


    $("#inputID").blur(function(){
        if(user_mode=='I'){
            $.ajax({
            url: "/checkID",
            type: "POST",
            dataType: "JSON",
            data: {
                id: function () {

                    return $("#inputID").val()
                }

            },
            success: function (data) {
                console.log('insertUser',data)
                if(data.ret){
                    $(".has-feedback").removeClass("has-error").addClass("has-success")
                    $(".glyphicon").removeClass("glyphicon-remove").addClass("glyphicon-ok")
                    $("#inputGroupSuccess4Status").text("(success)")
                    $("#txtcheckMsg").text("사용가능한 아이디입니다.")
                    check_id=true


                }else{
                    $(".has-feedback").removeClass("has-success").addClass("has-error")
                    $(".glyphicon").removeClass("glyphicon-ok").addClass("glyphicon-remove")
                    $("#inputGroupSuccess4Status").text("(error)")
                    $("#txtcheckMsg").text("중복된 아이디입니다.")
                    check_id=false
                }
            },
            error:function (error) {

            }
        });
        }

        

    })


    $("#btnLogin").click(function(){

        if($("#txtID").val()==''){
            alert('아이디를 입력해주세요')
            return
        }

        if($("#txtPW").val()==''){
            alert('패스워드를 입력해주세요')
            return
        }

        $.ajax({
            url: "/login",
            type: "POST",
            dataType: "JSON",
            data: {
                id: function () {

                    return $("#txtID").val()
                },
                pw: function () {

                    return $("#txtPW").val()
                },

            },
            success: function (data) {
                console.log('insertUser',data)

                if(data.auth){
                    sessionStorage.setItem('ID',Erypto.encrypt($("#txtID").val()))
                     $("#login-div").hide()
                     $("#main-div").show()
                     $("#txtID").val('')
                     $("#txtPW").val('')
                     $(".tabs-left").empty()
                     if(data.level!=2){
                         
                         $(".tabs-left").append(`
                         <li class="active"><a href="#MonitorMng" data-toggle="tab">모니터링보드</a></li>
                    <li><a href="#historyMng" data-toggle="tab">이력조회</a></li>
                         `)

                     }else{
                         
                        $(".tabs-left").append(`
                         <li class="active"><a href="#MonitorMng" data-toggle="tab">모니터링보드</a></li>
                    <li><a href="#userMng" data-toggle="tab">사용자관리</a></li>
                    <li><a href="#systemMng" data-toggle="tab">시스템관리</a></li>
                    <li><a href="#historyMng" data-toggle="tab">이력조회</a></li>
                         `)
                     }
                     
                }else{
                    alert('아이디나 패스워드가 틀렸습니다.')
                }
                
            },
            error:function (error) {
                    alert('시스템오류로 인해 다시 로그인해주시기바랍니다.')
            }
        });


       

    })

    $("#btnLogout").click(function(){
         $.ajax({
            url: "/logout",
            type: "POST",
            dataType: "JSON",
            data: {
                id: function () {

                    return Erypto.decrypt(sessionStorage.getItem('ID'))
                }

            },
            success: function (data) {
                console.log('insertUser',data)
                if(!data.auth){
                    $("#login-div").show()
                    $("#main-div").hide()
                }
                
            },
            error:function (error) {

            }
        });


        
    })

    $('#userModal').on('hidden.bs.modal', function (e) {
        $("#inputID").focus()
        $("#userModal input").val('')
        $(".has-feedback").removeClass("has-success").addClass("has-error")
        $(".glyphicon").removeClass("glyphicon-ok").addClass("glyphicon-remove")
        $("#inputGroupSuccess4Status").text("(error)")
        $("#txtcheckMsg").text('')
        $("#join-submit").hide()
        $("#edit-submit").hide()
 
    })

        $("#btnExcelDown").click(function(e){


           

            var f = document.createElement("form");

            f.setAttribute("id","formExcelExport");
            f.setAttribute("method","post");
            f.setAttribute("action",'/downHistory');
            document.body.appendChild(f);
            datas={
                startDate:$("#dateStart").val(),
                endDate:$("#dateEnd").val(),
                status:$("#txtStatus").val(),
                loss:$("#txtLoss").val(),
                text:$("#txtSearch_His").val()

            }
               
        
            $.each(datas, function(k, v) {
                console.log(k,v)
                var i = document.createElement("input");
                i.setAttribute("type","hidden");
                i.setAttribute("name",k);
                i.setAttribute("value",v);
                f.appendChild(i);
            });

            f.submit();

            var fid = f.id;
            document.getElementById(fid).remove();


        
    })


    $('#systemModal').on('show.bs.modal', function (e) {
       
        
 
    })

    $("#btnCreateUser").click(function(){
        $("#join-submit").show()
        user_mode='I'
    })


    //생성
    $("#join-submit").click(function(){

        if($("#inputID").val()==''){
            $("#inputID").focus()
           return  alert('아이디를 입력해주세요!')
        }

        if($("#inputPassword").val()==''){
            $("#inputPassword").focus()
           return  alert('비밀번호를 입력해주세요!')
        }

        if($("#inputPasswordCheck").val()==''){
            $("#inputPasswordCheck").focus()
           return  alert('비밀번호 확인을 입력해주세요!')
        }

        if($("#InputName").val()==''){
            $("#InputName").focus()
           return  alert('이름를 입력해주세요!')
        }

        if($("#inputPassword").val()!=$("#inputPasswordCheck").val()){
            $("#inputPassword").focus()
           return  alert('비밀번호가 다릅니다. 다시 입력해주세요!')
        }

        if(!check_id){
            return alert('사용할 수 없는 아이디입니다.')
        }

       

        $.ajax({
            url: "/insertUser",
            type: "POST",
            dataType: "JSON",
            data: {
                id: function () {

                    return $("#inputID").val()
                },
                pw: function () {

                    return $("#inputPassword").val()
                },
                name: function () {

                    return $("#InputName").val()
                },
                phone: function () {

                    return $("#inputMobile").val()
                },

            },
            success: function (data) {
                console.log('insertUser',data)
                $("#userModal").modal('hide')
                check_id=false
                
                

                $("#userGrid").jsGrid('loadData')
            },
            error:function (error) {

            }
        });

    })


    //수정
    $("#edit-submit").click(function(){

        

        if($("#inputPassword").val()==''){
            $("#inputPassword").focus()
           return  alert('비밀번호를 입력해주세요!')
        }

        if($("#inputPasswordCheck").val()==''){
            $("#inputPasswordCheck").focus()
           return  alert('비밀번호 확인을 입력해주세요!')
        }

        if($("#InputName").val()==''){
            $("#InputName").focus()
           return  alert('이름를 입력해주세요!')
        }

        if($("#inputPassword").val()!=$("#inputPasswordCheck").val()){
            $("#inputPassword").focus()
           return  alert('비밀번호가 다릅니다. 다시 입력해주세요!')
        }

          

       

        $.ajax({
            url: "/editUser",
            type: "POST",
            dataType: "JSON",
            data: {
                id: function () {

                    return $("#inputID").val()
                },
                pw: function () {

                    return Erypto.encrypt($("#inputPassword").val())
                },
                name: function () {

                    return $("#InputName").val()
                },
                phone: function () {

                    return $("#inputMobile").val()
                },

            },
            success: function (data) {
                console.log('editUser',data)
                $("#userModal").modal('hide')
                alert("계정 생성이 되었습니다.")

                
                

                $("#userGrid").jsGrid('loadData')
            },
            error:function (error) {

            }
        });

    })
 
   


    $("#btnSearch_total").click(function(){
        $("#userGrid").jsGrid('loadData') 
    })
    

    $("#btnHistory").click(function(){
        $("#historyGrid").jsGrid('loadData') 
        $("#statsGrid").jsGrid('loadData') 
    })



    $("#btnSystemSave").click(function(){
            let system_data=new Array()
            let user_id=$("#user-id").val()
            $("#inputBoardList input[type=checkbox]:checked").each(function() {

                system_data.push([this.value,user_id])

            });



            $.ajax({
            url: "/saveSystem",
            type: "POST",
            dataType: "JSON",
            data: {
                id: function () {

                    return user_id
                },
                system: function () {

                    return  JSON.stringify(system_data)
                }

            },
            success: function (data) {
                console.log('editUser',data)
                $("#systemModal").modal('hide')

                
                

                $("#userGrid").jsGrid('loadData')
            },
            error:function (error) {

            }
        });

            $("#user-id").val('')

    })

 
    //사용자계정 그리드
    $("#userGrid").jsGrid({
        width: "100%",
        height: "auto",
        editing: false,
        autoload: true,
        pageIndex:1,  
        sorting: true,
        paging: true,
        controller:  {
                loadData: function(filter) {
                    var d = $.Deferred();
                    $.ajax({
                        type: "POST",
                        url: "/getUserdata",
                        dataType: "JSON",
                        data: {
                            text: function () {
                                return $("#btn_search_user").val()
                            }
                        },
                    }).done(function(response) {
                        console.log('ok',response)
                        //ALLselectedItems=response.data;
                        // if(response.status == "OK") {
                        //     $("#txtMsg").text('조회되었습니다.')
                        // }else{
                        //     $("#txtMsg").text('조회가 실패되었습니다.')
                        // }

                        d.resolve(response.data);
                        
                    });
                    return d.promise();
                }

            },
 
        fields: [
            { title: "아이디", type: "text", width: 30 , name: "ID", align: "center"  },
            { title: "이름", type: "text", width: 5 , name: "NAME", align: "center",  },
            { title: "연락처", type: "text", width: 30 , name: "PHONE", align: "center"  },
            { title: "사용현황", type: "select", width: 10 , name: "DELYN", align: "center", items: del_data, valueField: "CODE", textField: "NAME"  },
            {

                    itemTemplate: function(_, item) {
                        

                            return $('<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#userModal">' +
                                '</button>').text("수정")
                                .on("click", function() {
                                    $("#edit-submit").show()
                                    $("#inputID").val(item.ID).attr('disabled',true)
                                    $("#inputGroupSuccess4Status").text('')
                                    $("#InputName").val(item.NAME)
                                    $("#inputPassword").val(Erypto.decrypt(item.PASSWORD))
                                    $("#inputPasswordCheck").val(Erypto.decrypt(item.PASSWORD))
                                    $("#inputMobile").val( item.PHONE)
                                    password_data=item.PASSWORD
                                    user_mode='E'
                                });
                        
                    },
                    align: "center",
                    width: 40,
                    sorting: false
                }, {

                    itemTemplate: function(_, item) {
                        

                            return $('<button type="button" class="btn btn-danger">' +
                                '</button>').text("삭제")
                                .on("click", function() {

                                    if(confirm(`ID : ${item.ID} 삭제 처리하시겠습니까?`)){
                                        $.ajax({
                                            url: "/deleteUser",
                                            type: "POST",
                                            dataType: "JSON",
                                            data: {
                                                id: function () {

                                                    return item.ID
                                                }

                                            },
                                            success: function (data) {

                                                alert(data.msg)

                                                $("#userGrid").jsGrid('loadData')
                                            },
                                            error:function (error) {
                                                console.log('error',error)
                                                alert(data.msg)
                                                $("#userGrid").jsGrid('loadData')

                                            }
                                        });

                                    }

                                });
                        
                    },
                    align: "center",
                    width: 40,
                    sorting: false
                }
        ]
    });



    //시스템설정 그리드
    $("#systemGrid").jsGrid({
        width: "100%",
        height: "auto",
        editing: false,
        autoload: true,
        pageIndex:1,  
        sorting: true,
        paging: true,
        controller:  {
                loadData: function(filter) {
                    var d = $.Deferred();
                    $.ajax({
                        type: "POST",
                        url: "/getUserdata",
                        dataType: "JSON",
                        data: {
                            text: function () {
                                return $("#btn_search_user").val()
                            }
                        },
                    }).done(function(response) {
                        console.log('ok',response)
                        //ALLselectedItems=response.data;
                        // if(response.status == "OK") {
                        //     $("#txtMsg").text('조회되었습니다.')
                        // }else{
                        //     $("#txtMsg").text('조회가 실패되었습니다.')
                        // }

                        d.resolve(response.data);
                        
                    });
                    return d.promise();
                }

            },
 
        fields: [
            { title: "아이디", type: "text", width: 30 , name: "ID", align: "center"  },
            { title: "이름", type: "text", width: 5 , name: "NAME", align: "center",  },
            { title: "연락처", type: "text", width: 30 , name: "PHONE", align: "center"  },
            { title: "사용현황", type: "select", width: 10 , name: "DELYN", align: "center", items: del_data, valueField: "CODE", textField: "NAME"  },
            {

                    itemTemplate: function(_, item) {
                        

                            return $('<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#systemModal">' +
                                '</button>').text("화면설정")
                                .on("click", function() {

                                         $.ajax({
                                                url: "/getBoarddata",
                                                type: "POST",
                                                dataType: "JSON",
                                                data: {
                                                    id: function () {

                                                        return item.ID
                                                    }

                                                },
                                                success: function (data) {
                                                    console.log('insertUser',data)
                                                    $("#userModal").modal('hide')

                                                    $("#user-id").val(item.ID)

                                                    var board_data=data.board[0]
                                                    var userBoard_data=data.user[0]
                                                    $("#inputBoardList").empty()
                                                    
                                                    board_data.forEach(function(item,index,arr2){ 
                                                       console.log(item,index);
                                                       $("#inputBoardList").append(`
                                                       <label class="checkbox-inline">
                                                        <input type="checkbox" id="inlineCheckbox${index+1}" value="${item.id}">
                                                        ${item.board_name} 
                                                    </label>
                                                       `)

                                                    })
                                                    //$("#inputBoardList input[value='1']").attr('checked',true)

                                                    userBoard_data.forEach(function(item,index,arr2){ 
                                                       console.log(item,index);
                                                  
                                                      $("#inputBoardList input[value='"+item.boardIDX+"']").attr('checked',true)
                                                       

                                                    })
                                                    
                                                    

                                                    $("#userGrid").jsGrid('loadData')
                                                },
                                                error:function (error) {

                                                }
                                            });
                                  
                                });
                        
                    },
                    align: "center",
                    width: 40,
                    sorting: false
                }
        ]
    });

        //이력조회 그리드
    $("#historyGrid").jsGrid({
        width: "100%",
        height: "auto",
        editing: false,
        autoload: true,
        pageIndex:1,  
        sorting: true,
        paging: true,
        controller:  {
                loadData: function(filter) {
                    var d = $.Deferred();
                    $.ajax({
                        type: "POST",
                        url: "/getHistorydata",
                        dataType: "JSON",
                        data: {
                            startDate: function () {
                                return $("#dateStart").val()
                            },
                            endDate: function () {
                                return $("#dateEnd").val()
                            },
                            status: function () {
                                return $("#txtStatus").val()
                            },
                            loss: function () {
                                return $("#txtLoss").val()
                            },
                            text: function () {
                                return $("#txtSearch_His").val()
                            }
                        },
                    }).done(function(response) {
                        console.log('ok',response)
                        //ALLselectedItems=response.data;
                        // if(response.status == "OK") {
                        //     $("#txtMsg").text('조회되었습니다.')
                        // }else{
                        //     $("#txtMsg").text('조회가 실패되었습니다.')
                        // }

                        d.resolve(response.data);
                        
                    });
                    return d.promise();
                }

            },
 
        fields: [
            { title: "생성일자", type: "text", width: 30 , name: "CREATETIME_LOG", align: "center"  },
            { title: "용기번호", type: "text", width: 5 , name: "BARCODE", align: "center",  },
            { title: "상태", type: "select", width: 10 , name: "STATUS", align: "center", items: STATUS, valueField: "CODE", textField: "NAME"  },
            { title: "입고시간", type: "text", width: 30 , name: "IN_TIME", align: "center"  },
            { title: "출고시간", type: "text", width: 30 , name: "OUT_TIME", align: "center"  },
            { title: "불량", type: "select", width: 10 , name: "LOSS", align: "center", items: LOSS_DATA, valueField: "CODE", textField: "NAME"  }

           
        ]
    });

   //용기별 통계
   $("#statsGrid").jsGrid({
    width: "100%",
    height: "auto",
    editing: false,
    autoload: true,
    pageIndex:1,  
    sorting: true,
    paging: true,
    controller:  {
            loadData: function(filter) {
                var d = $.Deferred();
                $.ajax({
                    type: "POST",
                    url: "/getHistorydata_stats",
                    dataType: "JSON",
                    data: {
                        startDate: function () {
                            return $("#dateStart").val()
                        },
                        endDate: function () {
                            return $("#dateEnd").val()
                        },
                        status: function () {
                            return $("#txtStatus").val()
                        },
                        loss: function () {
                            return $("#txtLoss").val()
                        },
                        text: function () {
                            return $("#txtSearch_His").val()
                        }
                    },
                }).done(function(response) {
                    console.log('ok',response)
                    //ALLselectedItems=response.data;
                    // if(response.status == "OK") {
                    //     $("#txtMsg").text('조회되었습니다.')
                    // }else{
                    //     $("#txtMsg").text('조회가 실패되었습니다.')
                    // }

                    d.resolve(response.data);
                    
                });
                return d.promise();
            }

        },

        fields: [
            { title: "용기번호", type: "text", width: 5 , name: "BARCODE", align: "center",  },
            { title: "불량횟수", type: "text", width: 30 , name: "loss_cnt", align: "center"  }

        
        ]
    });





       //모니터링보드 그리드
    $("#MonitorGrid").jsGrid({
        width: "100%",
        height: "auto",
        editing: false,
        autoload: true,
        pageIndex:1,  
        sorting: true,
        paging: true,
        controller:  {
                loadData: function(filter) {
                    var d = $.Deferred();
                    $.ajax({
                        type: "POST",
                        url: "/getMonitordata",
                        dataType: "JSON",
                        data: {
                            
                        },
                    }).done(function(response) {
                        console.log('ok',response)
                        //ALLselectedItems=response.data;
                        // if(response.status == "OK") {
                        //     $("#txtMsg").text('조회되었습니다.')
                        // }else{
                        //     $("#txtMsg").text('조회가 실패되었습니다.')
                        // }

                        d.resolve(response.data);
                        
                    });
                    return d.promise();
                }

            },
 
        fields: [
            { title: "ID", type: "text", width: 30 , name: "id", align: "center"  },
            { title: "모니터링보드", type: "text", width: 5 , name: "board_name", align: "center",  },
            { title: "재생시건", type: "text", width: 30 , name: "board_sec", align: "center"  },
            {

                    itemTemplate: function(_, item) {
                        

                            return $('<button type="button" class="btn btn-primary"' +
                                '</button>').text("열기")
                                .on("click", function() {

                                    var popUrl = MAIN_IP+'/'+item.board_addr
                                        var popOption = "top=10, left=10, width=500, height=600, status=no, menubar=no, toolbar=no, resizable=no";
                                        window.open(popUrl, popOption);




                                 
                                  
                                });
                        
                    },
                    align: "center",
                    width: 40,
                    sorting: false
                }

           
        ]
    });

    





    function login(){

    }
});


