var app = getApp(), api = app.api, is_no_more = !1, is_loading = !1, p = 2;

Page({
    data: {
      status:1,
        first_count: 0,
        second_count: 0,
        third_count: 0,
        list: Array,
        no_more: !1
    },
    onLoad: function(t) {
      var that =this
      console.log(that.data.status)
      console.log(wx.getStorageSync("status") )
      if (wx.getStorageSync("status")){
        that.data.status = wx.getStorageSync("status")
      }
        getApp().page.onLoad(this, t);
        var a = getApp().core.getStorageSync(getApp().const.SHARE_SETTING);
        this.setData({
            share_setting: a
        }), is_no_more = is_loading = !1, p = 2, this.GetList(that.data.status || 1);
    },
    GetList: function(t) {
        var a = this;
        is_loading || (is_loading = !0, a.setData({
          status: parseInt(a.data.status || 1)
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.share.get_team,
            data: {
                status: a.data.status,
                page: 1
            },
            success: function(t) {
wx.removeStorageSync("status")            
    a.setData({
                    first_count: t.data.first,
                    second_count: t.data.second,
                    third_count: t.data.third,
                    list: t.data.list
                }), 0 == t.data.list.length && (is_no_more = !0, a.setData({
                    no_more: !0
                }));
            },
            complete: function() {
                getApp().core.hideLoading(), is_loading = !1;
            }
        }));
    },
    onReachBottom: function() {
        is_no_more || this.loadData();
    },
    loadData: function() {
        if (!is_loading) {
            is_loading = !0;
            var a = this;
            getApp().core.showLoading({
                title: "正在加载",
                mask: !0
            }), getApp().request({
                url: getApp().api.share.get_team,
                data: {
                    status: a.data.status,
                    page: p
                },
                success: function(t) {
                    a.setData({
                        first_count: t.data.first,
                        second_count: t.data.second,
                        third_count: t.data.third,
                        list: a.data.list.concat(t.data.list)
                    }), 0 == t.data.list.length && (is_no_more = !0, a.setData({
                        no_more: !0
                    }));
                },
                complete: function() {
                    getApp().core.hideLoading(), is_loading = !1, p++;
                }
            });
        }
    },
  switchTab:function(e){
wx.setStorage({
  key: 'status',
  data: e.currentTarget.dataset.id,
})

    wx.reLaunch({
      url: '/pages/share-team/share-team',
    })
  },
});