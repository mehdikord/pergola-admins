<script>

export default {
  name: "Template_Header_Shortcuts",
  data(){
    return {

    }
  },
  methods:{


  },
  mounted() {
  }

}
</script>

<template>
  <q-btn  title="د‍سترسی سریع" round >
    <q-avatar rounded size="25px">
      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="grid-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-grid-2 fa-lg"><path fill="currentColor" d="M224 80c0-26.5-21.5-48-48-48H80C53.5 32 32 53.5 32 80v96c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V80zm0 256c0-26.5-21.5-48-48-48H80c-26.5 0-48 21.5-48 48v96c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V336zM288 80v96c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48H336c-26.5 0-48 21.5-48 48zM480 336c0-26.5-21.5-48-48-48H336c-26.5 0-48 21.5-48 48v96c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48V336z" class=""></path></svg>

    </q-avatar>
    <q-menu
        transition-show="flip-right"
        transition-hide="flip-left"
         style="width: 360px">
      <q-card-section>
        <strong class="text-red">دسترسی سریع</strong>
        <div class="row text-center q-mt-sm">
          <div class="col-md-2 col-sm-3 col-xs-4">
            <q-btn color="primary" flat icon="fa-duotone fa-light fa-envelope-open-text" round size="17px">
              <q-tooltip
                  transition-show="rotate"
                  transition-hide="rotate"
              >
                <strong>صندوق ورودی</strong>
              </q-tooltip>
            </q-btn>
          </div>
          <div class="col-md-2 col-sm-3 col-xs-4">
            <q-btn color="grey-9" flat icon="fa-duotone fa-light fa-paper-plane" round size="17px">
              <q-tooltip
                  transition-show="rotate"
                  transition-hide="rotate"
              >
                <strong>ارسالی ها</strong>
              </q-tooltip>
            </q-btn>
          </div>


        </div>

      </q-card-section>
    </q-menu>
  </q-btn>
</template>

<style scoped>

</style>