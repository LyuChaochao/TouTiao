<template>
  <div class="article-list" ref="article-list">
    <van-pull-refresh
      v-model="isreFreshLoading"
      :success-text="refreshSuccessText"
      :success-duration="1500"
      @refresh="onRefresh"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'
import { debounce } from 'lodash'
 
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isreFreshLoading: false, // 控制下拉刷新的 loading 状态
      refreshSuccessText: '刷新成功', // 下拉刷新成功提示文本
      scrollTop: 0
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {
    const articleList = this.$refs['article-list']
    articleList.onscroll = debounce(() => {
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  activated () {
    this.$refs['article-list'].scrollTop = this.scrollTop
  },
  methods: {
    async onLoad () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 把请求结果数据放到 list 数组中
        const { results } = data.data
        this.list.push(...results)

        // 把加载状态设置为结束
        this.loading = false

        // 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    },

    async onRefresh () {
      try {
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: Date.now(), // 下拉刷线，每次请求获取最新数据，所以传递当前最新时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 2. 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)

        this.isreFreshLoading = false

        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.refreshSuccessText = '刷新失败'
        this.isreFreshLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
