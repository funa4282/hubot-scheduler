module.exports = function(robot) {
    return robot.hear(/(天気)$/i, function(msg) {
        const exec = require('child_process').exec;
        const jimp = require("jimp");
        const request = require('request');
        const location = "41.9027, 12.4963";
        const key = "API KEY";
        const url = "https://api.darksky.net/forecast/" + key + "/" + location + "?lang=ja&units=si";
        const channel = msg.message.rawMessage.channel;
        const json = request.get({
            uri: url,
            json: true
        }, function(err, req, data){
            if (err) {
                return msg.send("エラーが発生しました");
            } else {
                let dateTime;
                let hour;
                let hourlyData;
                let foundation=140;
                let width=120;
                let count=0;
                let percent=100;

                jimp.read("./scripts/images/template.png").then(function (template) {
                    for (var i=0; i < 16; i++) {
                        hourlyData = data["hourly"]["data"][i+1];
                        dateTime = new Date(hourlyData.time * 1000);
                        // dateTime.setTime(dateTime.getTime() + 1000*60*60*9);// JSTに変換
                        hour = (dateTime.getHours() < 10) ? '0' + dateTime.getHours() : dateTime.getHours().toString(10);

                        let timezoneoffset = -9;     // UTC-表示したいタイムゾーン(単位:hour)。JSTなら-9
                        let fakeUTC = new Date(dateTime - (timezoneoffset * 60 - dateTime.getTimezoneOffset()) * 60000);
                        hour = fakeUTC.getHours();

                        percent = Math.round(hourlyData.precipProbability * 10) / 10 * 100;
                        if (hour%3 == 0) {
                            // msg.send(hour.toString());
                            if (hourlyData.icon.match(/cloudy/)) {
                                jimp.read("./scripts/images/cloudy.png").then(function (cloudy) {
                                    template.composite(cloudy, foundation + width*count, 70).write("./tmp/template.png");
                                }).catch(function (err) {
                                    msg.send(hour + "の天気画像の読み込みに失敗しました");
                                });
                                jimp.read("./scripts/images/" + percent +".png").then(function (num) {
                                    template.composite(num, foundation + width*count + 35, 210).write("./tmp/template.png");
                                    count++;
                                }).catch(function (err) {
                                    msg.send(hour + "の降水確率の読み込みに失敗しました");
                                });
                            } else if (hourlyData.icon.match(/rain/)) {
                                jimp.read("./scripts/images/rainy.png").then(function (rainy) {
                                    template.composite(rainy, foundation + width*count, 70).write("./tmp/template.png");
                                }).catch(function (err) {
                                    msg.send(hour + "の天気画像の読み込みに失敗しました");
                                });
                                jimp.read("./scripts/images/" + percent +".png").then(function (num) {
                                    template.composite(num, foundation + width*count + 35, 210).write("./tmp/template.png");
                                    count++;
                                }).catch(function (err) {
                                    msg.send(hour + "の降水確率の読み込みに失敗しました");
                                });
                            } else if (hourlyData.icon.match(/clear/)) {
                                jimp.read("./scripts/images/sunny.png").then(function (sunny) {
                                    template.composite(sunny, foundation + width*count, 70).write("./tmp/template.png");
                                }).catch(function (err) {
                                    msg.send(hour + "の天気画像の読み込みに失敗しました");
                                });
                                jimp.read("./scripts/images/" + percent +".png").then(function (num) {
                                    template.composite(num, foundation + width*count + 35, 210).write("./tmp/template.png");
                                    count++;
                                }).catch(function (err) {
                                    msg.send(hour + "の降水確率の読み込みに失敗しました");
                                });
                            }
                        }
                    }
                }).catch(function (err) {
                    return msg.send("画像の読み込みに失敗しました");
                });
                // return exec("curl -F file=@./tmp/template.png -F channels=" + channel + " -F token=" + process.env.HUBOT_SLACK_TOKEN + " https://slack.com/api/files.upload", function(err) {
                //     if (err) {
                //         return msg.send("画像の送信に失敗しました");
                //     }
                // });
            }
        });
    });
};