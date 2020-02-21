module.exports = function(robot) {
    return robot.hear(/(送る)$/i, function(msg) {
        const exec = require('child_process').exec;
        const channel = msg.message.rawMessage.channel;

        return exec("curl -F file=@./tmp/template.png -F channels=" + channel + " -F token=" + process.env.HUBOT_SLACK_TOKEN + " https://slack.com/api/files.upload", function(err) {
            if (err) {
                return msg.send("画像の送信に失敗しました");
            }
        });
    });
}