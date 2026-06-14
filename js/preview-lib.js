// ================================
// 梅睿贸易官网 — 媒体预览库
// 独立无依赖，用于生成的静态页面
// ================================

(function() {
    'use strict';

    // ---- 注入样式 ----
    var style = document.createElement('style');
    style.textContent = `
        .mrt-overlay { position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.7); display:none; align-items:center; justify-content:center; }
        .mrt-overlay.active { display:flex; }
        .mrt-box { background:#fff; border-radius:12px; max-width:800px; width:90%; max-height:90vh; padding:20px 24px; text-align:center; position:relative; overflow:hidden; }
        .mrt-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
        .mrt-header h3 { font-size:15px; font-weight:600; color:#333; margin:0; }
        .mrt-header h3 small { font-size:13px; color:#999; font-weight:400; margin-left:8px; }
        .mrt-close { width:28px;height:28px;border-radius:50%;border:none;background:#e53935;color:#fff;font-size:16px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0; }
        .mrt-media-wrap { position:relative; display:flex; align-items:center; justify-content:center; min-height:80px; max-height:65vh; overflow:hidden; border-radius:8px; background:#f5f5f5; }
        .mrt-media-wrap img, .mrt-media-wrap video { max-width:100%; max-height:60vh; display:block; border-radius:8px; object-fit:contain; }
        .mrt-prev, .mrt-next { position:absolute; top:50%; transform:translateY(-50%); width:40px; height:40px; border-radius:50%; border:none; background:rgba(0,0,0,0.45); color:#fff; font-size:24px; cursor:pointer; display:none; align-items:center; justify-content:center; z-index:10; transition:background 0.2s; }
        .mrt-prev { left:8px; }
        .mrt-next { right:8px; }
        .mrt-prev:hover, .mrt-next:hover { background:rgba(0,0,0,0.65); }
        .mrt-actions { margin-top:14px; display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
        .mrt-btn-download { padding:10px 28px; background:#1a73e8; color:#fff; border:none; border-radius:8px; cursor:pointer; font-size:14px; font-weight:500; }
        .mrt-btn-close { padding:10px 28px; background:#f0f0f0; color:#666; border:none; border-radius:8px; cursor:pointer; font-size:14px; }
        .mrt-btn-download:hover { background:#1557b0; }
        .mrt-btn-close:hover { background:#e0e0e0; }
    `;
    document.head.appendChild(style);

    // ---- 状态 ----
    var _mrtData = null; // { type:'image'|'video', items:[urls], index:0 }

    // ---- 创建弹窗 DOM ----
    var overlay = document.createElement('div');
    overlay.className = 'mrt-overlay';
    overlay.innerHTML = `
        <div class="mrt-box">
            <div class="mrt-header">
                <h3 id="mrtTitle">🔍 预览</h3>
                <button class="mrt-close" onclick="MRT.close()">✕</button>
            </div>
            <div class="mrt-media-wrap">
                <button class="mrt-prev" id="mrtPrev" onclick="MRT.prev()">‹</button>
                <img id="mrtImage" src="" style="display:none;">
                <video id="mrtVideo" src="" style="display:none;" controls></video>
                <button class="mrt-next" id="mrtNext" onclick="MRT.next()">›</button>
            </div>
            <div class="mrt-actions">
                <button class="mrt-btn-download" id="mrtDownloadBtn" onclick="MRT.download()">📥 下载</button>
                <button class="mrt-btn-close" onclick="MRT.close()">关闭</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // ---- 公开 API ----
    window.MRT = {
        open: function(type, items, index) {
            index = index || 0;
            _mrtData = { type: type, items: items, index: index };
            var title = document.getElementById('mrtTitle');
            var img = document.getElementById('mrtImage');
            var video = document.getElementById('mrtVideo');
            var prev = document.getElementById('mrtPrev');
            var next = document.getElementById('mrtNext');
            var downloadBtn = document.getElementById('mrtDownloadBtn');

            if (type === 'image') {
                title.innerHTML = '🔍 图片预览 <small id="mrtCounter">(' + (index+1) + '/' + items.length + ')</small>';
                img.style.display = '';
                video.style.display = 'none';
                video.pause();
                video.src = '';
                img.src = items[index];
                downloadBtn.textContent = '📥 下载图片';
            } else {
                title.innerHTML = '🎬 视频预览';
                img.style.display = 'none';
                img.src = '';
                video.style.display = '';
                video.src = items[index];
                video.load();
                setTimeout(function() { video.play().catch(function() {}); }, 100);
                downloadBtn.textContent = '📥 下载视频';
            }

            if (items.length > 1) {
                prev.style.display = 'flex';
                next.style.display = 'flex';
            } else {
                prev.style.display = 'none';
                next.style.display = 'none';
            }
            prev.style.opacity = (index > 0) ? '1' : '0.3';
            next.style.opacity = (index < items.length - 1) ? '1' : '0.3';

            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        },

        close: function() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            var video = document.getElementById('mrtVideo');
            if (video) { video.pause(); video.src = ''; }
            _mrtData = null;
        },

        prev: function() {
            if (!_mrtData || _mrtData.index <= 0) return;
            _mrtData.index--;
            var item = _mrtData.items[_mrtData.index];
            if (_mrtData.type === 'image') {
                document.getElementById('mrtImage').src = item;
                document.getElementById('mrtTitle').innerHTML = '🔍 图片预览 <small>(' + (_mrtData.index+1) + '/' + _mrtData.items.length + ')</small>';
            } else {
                var v = document.getElementById('mrtVideo');
                v.src = item; v.load(); setTimeout(function(){v.play().catch(function(){})},100);
            }
            document.getElementById('mrtPrev').style.opacity = (_mrtData.index > 0) ? '1' : '0.3';
            document.getElementById('mrtNext').style.opacity = (_mrtData.index < _mrtData.items.length - 1) ? '1' : '0.3';
        },

        next: function() {
            if (!_mrtData || _mrtData.index >= _mrtData.items.length - 1) return;
            _mrtData.index++;
            var item = _mrtData.items[_mrtData.index];
            if (_mrtData.type === 'image') {
                document.getElementById('mrtImage').src = item;
                document.getElementById('mrtTitle').innerHTML = '🔍 图片预览 <small>(' + (_mrtData.index+1) + '/' + _mrtData.items.length + ')</small>';
            } else {
                var v = document.getElementById('mrtVideo');
                v.src = item; v.load(); setTimeout(function(){v.play().catch(function(){})},100);
            }
            document.getElementById('mrtPrev').style.opacity = (_mrtData.index > 0) ? '1' : '0.3';
            document.getElementById('mrtNext').style.opacity = (_mrtData.index < _mrtData.items.length - 1) ? '1' : '0.3';
        },

        download: async function() {
            if (!_mrtData) return;
            var url = _mrtData.items[_mrtData.index];
            if (!url) return;
            var parts = url.split('/');
            var fileName = parts[parts.length-1] || 'file';
            var ext = fileName.includes('.') ? fileName.split('.').pop() : (_mrtData.type === 'image' ? 'jpg' : 'mp4');
            try {
                var resp = await fetch(url);
                var blob = await resp.blob();
                if ('showSaveFilePicker' in window) {
                    try {
                        var handle = await window.showSaveFilePicker({
                            suggestedName: fileName,
                            types: [{ description: _mrtData.type === 'image' ? '图片文件' : '视频文件', accept: { 'image/*': ['.jpg','.png','.gif','.webp','.jpeg'], 'video/*': ['.mp4','.webm','.mov'] } }]
                        });
                        var writable = await handle.createWritable();
                        await writable.write(blob);
                        await writable.close();
                        return;
                    } catch(e) {
                        if (e.name !== 'AbortError' && e.name !== 'SecurityError') throw e;
                    }
                }
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(function() { URL.revokeObjectURL(a.href); }, 3000);
            } catch(e) {
                alert('下载失败: ' + e.message);
            }
        }
    };

    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') { MRT.prev(); e.preventDefault(); }
        if (e.key === 'ArrowRight') { MRT.next(); e.preventDefault(); }
        if (e.key === 'Escape') { MRT.close(); e.preventDefault(); }
    });

})();