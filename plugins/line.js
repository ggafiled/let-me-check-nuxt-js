import Vue from "vue";
import * as line from "@line/bot-sdk";

const config = {
    channelAccessToken: "kS33WAWpGOQmSABYZ6/jGpT8YP4YvEaALbGm3ldNlqdibzji0cR1xCm1hJ1Ofcd8ICy3rvqayw4qNWtsiDHBZYxzWzL35+27G5coSZxOxT8S3ZbyU2vJqnV9jZHNY+//0Z4tluhOfV39LAQ/4oiguQdB04t89/1O/w1cDnyilFU=",
    channelSecret: "c3530bb7b3ba8ea8f70fc52ab72a40ab"
};

Vue.prototype.line = new line.Client(config);