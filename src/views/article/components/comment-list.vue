<template>
  <van-list
    v-model="loading"
    :finished="finished"
    finished-text="已显示全部评论"
    :error="error"
    error-text="加载失败，请点击重试"
    :immediate-check="false"
    @load="onLoad"
  >
    <comment-item
      v-for="(item, index) in list"
      :key="index"
      :comment="item"
      @reply-click="$emit('reply-click', $event)"
    />
  </van-list>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'

export default {
  name: 'CommentList',
  components: {
    CommentItem
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true
    },
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    }
  },
  data () {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的标记
      limit: 10,
      error: false
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loading = true
    this.onLoad()
  },
  mounted () {},
  methods: {
    async onLoad () {
      try {
        const { data } = await getComments({
          type: this.type, //  评论类型
          source: this.source.toString(), // 文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
        })

        // 将数据添加到列表中
        const { results } = data.data
        this.list.push(...results)

        // 把文章评论的总数量传递到外部
        this.$emit('onload-success', data.data)

        this.loading = false

        // 判断是否还有数据
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style scoped lang="less"></style>
