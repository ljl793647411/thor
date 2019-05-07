<template>
  <section>
    <router-link to="/daily-report" class="ds-icon"></router-link>
    <router-link to="/person-dashboard" class="op-icon"></router-link>
    <router-link to="/lm-dashboard" class="om-icon"></router-link>
    <router-link to="" class="rc-icon"></router-link>
    </div>
  </section>
</template>

<script>
</script>

<style scoped>
  section{
    width: 900px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
  }
  @media (min-width: 1680px){
    section{
      padding-top: 240px;
    }
  }
  @media (min-width: 1440px) and (max-width: 1680px){
    section{
      padding-top: 160px;
    }
  }
  @media (max-width: 1440px){
    section{
      padding-top: 110px;
    }
  }
  section a {
    width: 155px;
    height: 232px;
    display: block;
    background-color:rgba(0,0,0,0.66);
    border:1px solid rgba(230,230,230,1);
    border-radius:10px;
  }
  
  .ds-icon{
    background-image: url('../../../static/ds.png');
  }
  .op-icon{
    background-image: url('../../../static/op.png');
  }
  .om-icon{
    background-image: url('../../../static/om.png');
  }
  .rc-icon{
    background-image: url('../../../static/run-chart.png');
  }
</style>