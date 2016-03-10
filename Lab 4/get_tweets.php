<?php
require_once('TwitterAPIExchange.php');

$settings = array(
    'oauth_access_token' => '985962829-BGOw3Yh4sQNfIybKhnDup53Tg4k8AN3wrwa7mqKB',
    'oauth_access_token_secret' => '0NCCWK2l7WiRBd7IYTmu2KqTx7Hf8Bmf0YTiVOyVOp2dW',
    'consumer_key' => '9hu0L6XjfvbDjKvXoNVUQekYE',
    'consumer_secret' => 'EMtgBwSxmkul1yHjPUZ75PTxDUlBAgVtgusoiVDyG0CkurvPVF'
);

$url = "https://api.twitter.com/1.1/search/tweets.json";
$requestMethod = "GET";

$query = '?q=';
if(isset($_GET['q']) && $_GET['q']!='' ) {

    $query .= $_GET['q'];

} else {
    $query .= 'something';
}

//echo $query;
$twitter = new TwitterAPIExchange($settings);
$results = $twitter->setGetfield($query)->buildOauth($url, $requestMethod)->performRequest();
echo $results;
?>
