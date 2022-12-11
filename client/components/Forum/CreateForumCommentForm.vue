<script>
import BlockForm from '@/components/common/BlockForm.vue';
export default {
  name: 'CreateForumCommentForm',
  mixins: [BlockForm],
  data() {
    return {
      url: `/api/comments/${this.$route.params.postId}`,
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Content', value: ''}
      ],
      title: 'Comment',
      refreshComments: true,
      callback: () => {
        const message = 'Successfully created a forum comment!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>