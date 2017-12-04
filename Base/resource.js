var res = {
    MainScene_json : "res/MainScene.json",
    PlayScene_json : "res/PlayScene.json",
    LoadingScene_json: "res/LoadingScene.json",
    MapScene_json: "res/MapScene.json",
    GameOverDialog: "res/GameOverDialog.json",
    SelectedDialog: "res/MapInfoDialog.json",
    playSceneImage: {type: "image", src: "res/playScene.png"},
    playScenePlist: {type: "plist", src: "res/playScene.plist"}
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
};
