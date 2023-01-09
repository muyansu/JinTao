let solarLunar =require('solarlunar-es');
var request = require('request');//request请求模块

var schedule = require('node-schedule');//定时执行模块
let appID = 'wx362d1f1eb005ac4e'//测试号appID（写你自己的）
let appsecret = '02b5399b7c7a8a643043b119de456d09'//测试号appsecret（写你自己的）

let getAccessToken = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`//获取AccessToken
let getWeather = `https://www.yiketianqi.com/free/day?appid=72693185&appsecret=DQb7Pxn9&unescape=1&cityid=101280800`//获取指定地区天气（写你自己的）//长春
// let getWeather = `https://www.yiketianqi.com/free/day?appid=72693185&appsecret=DQb7Pxn9&unescape=1&cityid=101060401`//四平//101280800 佛山
let getStatements = `https://v2.alapi.cn/api/qinghua?token=WcCTcBCxcT57YWY5`//获取每日一句（写你自己的）
let sendMessage = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='//发送模板
function getTargetTime(t){//获取指定日期到今天的天数
	date = new Date();
    date1 =Date.parse(t);
    date2=date.getTime();
    var distance= Math.abs(date2 - date1 );
    //毫秒数除以一天的毫秒数,就得到了天数
    var days = Math.floor(distance / (24 * 3600 * 1000));
    return days ;

}
console.log(getTargetTime('2022-10-06'))
console.log(getTargetTime('2022-10-25'))
function coloring() {//随机颜色
	return '#' + (Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0'))
}

let AccessToken = new Promise((res,rej)=>{//获取微信AccessToken
    request({
		url: getAccessToken,
		method: "get",
		json: true,
		headers: {"content-type": "application/json"},
	}, 
	(error,response,body)=>{
		if (!error) {
            res(body.access_token)
        }else{
            console.log(error)
        }
	}); 
});

let Weather = new Promise((res,rej)=>{//获取指定地区天气
    request({
        url: getWeather,
        method: "get",
        json: true,
        headers: {"content-type": "application/json"},
    }, 
    (error,response,body)=>{
        if (!error) {
            res(body)
        }else{
            console.log(error)
        }
    }); 
});

let Statements = new Promise((res,rej)=>{//获取每日一句
    request({
        url: getStatements,
        method: "post",
        json: true,
        headers: {"content-type": "application/json"},
    }, 
    (error,response,body)=>{
        if (!error) {
            res(body.data.content)
        }else{
            console.log(error)
        }
    }); 
});
//测试的时候可以改为    3 * * * * *   每分钟的第三秒执行一次
// 0 0 7 * * * 每天早上7点执行一次
// schedule.scheduleJob('* 1 * * * *',()=>{//每天早上7点执行一次
    console.log('我执行啦')
	Promise.all([AccessToken,Weather,Statements]).then((res)=>{
        console.log(res)
		let data = {
			touser:'o3rwE6UUVX0UkOTncJXS_m63Mq_k',//发送人的微信号ID（写你自己的）
			template_id:'tgsUQjmmxFvpj7vIJZuZVcbkYPJsd5zjsKdq_nxH9Bg',//测试模板的ID（写你自己的）
			data:{
				data1:{//多少天
					value:String(getTargetTime('2021-03-17')),//设置在一起的日子，格式别变
					color:coloring()
				},
                data2:{//多少天
					value:String(getTargetTime('2023-03-18')),//设置在一起的日子，格式别变
					color:coloring()
				},
                data3:{//多少天
					value:String(getTargetTime('2023-10-25')),//设置在一起的日子，格式别变
					color:coloring()
				},
				data4:{//多少天
					value:String(getTargetTime('2023-09-03')),//设置在一起的日子，格式别变
					color:coloring()
				},
				data5:{//多少天
					value:String(getTargetTime('2022-12-29')),//设置在一起的日子，格式别变
					color:coloring()
				},
				remake:{//备注
					value:'距离考研又近了一天',
					color:coloring()
				},
				content:{//每日一句
					value:res[2],
					color:coloring()
				},
				city:{//城市
					value:res[1].city,
					color:coloring()
				},
				date:{//当前日期
					value:res[1].date,
					color:coloring()
				},
				week:{//星期几
					value:res[1].week,
					color:coloring()
				},
				wea:{//天气
					value:res[1].wea,
					color:coloring()
				},
				win:{//什么风
					value:res[1].win,
					color:coloring()
				},
				// win_speed:{//风力
				// 	value:res[1].win_speed,
				// 	color:coloring()
				// },
				// win_meter:{//分速
				// 	value:res[1].win_meter,
				// 	color:coloring()
				// },
				tem_day:{//最高温度
					value:res[1].tem_day,
					color:coloring()
				},
				tem_night:{//最低温度
					value:res[1].tem_night,
					color:coloring()
				},
				// pressure:{//气压值
				// 	value:res[1].pressure,
				// 	color:coloring()
				// },
				// humidity:{//相对湿度
				// 	value:res[1].humidity,
				// 	color:coloring()
				// },
			}
		}
		request({
			url: sendMessage + res[0],
			method: "post",
			json: true,
			headers: {"content-type": "application/json"},
			body:data
		}, 
		(error,response,body)=>{
			if (!error) {
				if(body.errcode == 0){
					console.log('发送成功！！！')
				}
			}else{
                console(error)
            }
		}); 
	},(reject)=>{
        console.log(reject)
    })
    

// });

console.log('运行成功，等待程序发送中........')

//模板示例
// 

// 今天是：{{date.DATA}} {{week.DATA}} 
// {{remake.DATA}} 
// 当前城市：{{city.DATA}} 
// 今天的天气：{{wea.DATA}},{{win.DATA}} 
// 今天的最低温度：{{tem_night.DATA}}℃ 
// 今天的最高温度：{{tem_day.DATA}}℃ 
// 距离你的生日还有{{data2.DATA}}天 
// 距离你哥的生日还有{{data3.DATA}}天 
// 距离老妈的生日还有{{data4.DATA}}天 
// 距离老爸的生日还有{{data5.DATA}}天 

// {{content.DATA}}

