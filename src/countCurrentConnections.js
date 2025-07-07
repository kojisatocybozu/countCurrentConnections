(function() {
    'use strict';
    kintone.events.on('app.record.index.show', function(event) {
        if (document.getElementById('my_custom_button') !== null) {
            return event;
        }
        const myButton = document.createElement('button');
        myButton.id = 'my_custom_button';
        myButton.className = 'kintoneplugin-button-normal';
        myButton.innerText = 'API同時接続数取得';
        myButton.onclick = function() {
            if (confirm('APIの、同時接続数を取得します')) {
            kintone.api.getConcurrencyLimit().then((result) => {
                const ApiLimit = result.limit; // 同時接続数の上限値
                const ApiRunning = result.running; // 現在の同時接続数
                // 接続数が「上限値-20」を超える場合、後続処理を行わない
                if (ApiRunning > ApiLimit - 20) {
                    console.log('処理を中断しました。');
                    return;
                }
                const now = new Date();
                const isoDateTime = now.toISOString();
                const body = {
                    app: kintone.app.getId(),
                    record: {
                        "日時": { value: isoDateTime },
                        "数値": { value: ApiRunning },
                        "数値_0": { value: ApiLimit}
                    }
                };
                kintone.api(kintone.api.url('/k/v1/record', true), 'POST', body, (resp) => {
                    // success
                   console.log("ApiLimit: " + ApiLimit);
                   console.log("ApiRunning: " + ApiRunning);
                   location.reload(); // ページをリロードする
                }, (error) => {
                    // error
                   console.log(error);
                });
            });
            }
        };
        const headerMenuSpace = kintone.app.getHeaderMenuSpaceElement();
        if (headerMenuSpace) {
            headerMenuSpace.appendChild(myButton);
        }
        return event;
    });
})();
