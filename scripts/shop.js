module.exports = function(robot) {
    return robot.hear(/(お店)$/i, function(msg) {
        const request = require('request');
        const url = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=API KEY&lat=hoge&lng=hoge&range=hoge&format=json";
        const json = request.get({
            uri: url,
            json: true
        }, function(err, res, data) {
            if (err) {
                return msg.send("エラーが発生しました");
            } else {
                var num, shopName, shopUrl;
                num = Math.floor(Math.random() * 11);
                shopName = data["results"]["shop"][num]["name"];
                shopUrl = data["results"]["shop"][num]["urls"]["pc"];
                return msg.send({room: "play"}, shopName + " \n " + shopUrl);
            }
        });
    });
}