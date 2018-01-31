<template>
  <div>
    <div class="main-panel">
      <section class="sidebar">
        <ul>
          <li>Test1</li>
          <li>Test2</li>
          <li>Test3</li>
          <li>Test4</li>
          <li>Test5</li>
          <li>Test6</li>
          <li>Test7</li>
          <li>Test8</li>
          <li>Test9</li>
          <li>Test10</li>
          <li>Test11</li>
          <li>Test12</li>
          <li>Test13</li>
          <li>Test14</li>
          <li>Test15</li>
          <li>Test16</li>
          <li>Test17</li>
          <li>Test18</li>
          <li>Test19</li>
          <li>Test20</li>
          <li>Test21</li>
          <li>Test22</li>
          <li>Test23</li>
          <li>Test24</li>
          <li>Test25</li>
          <li>Test26</li>
          <li>Test27</li>
          <li>Test28</li>
          <li>Test29</li>
          <li>Test30</li>
        </ul>
      </section>
      <main class="content">
        <song-list></song-list>
      </main>
    </div>
    <footer class="footer">
      test
    </footer>
  </div>
</template>

<script>
  import SongList from './SongList'

  export default {
    name: 'main-panel',
    components: { SongList }
  }
</script>

<style scoped>
  .sidebar {
    float: left;
    width: 120px;
    background-color: blueviolet;
    height: 100%;
    overflow: auto;
  }

  .content {
    width: auto;
    height: 100%;
    overflow: auto;
  }

  .main-panel {
    height: calc(100vh - 100px);
    width: 100%;
    background: rgb(142, 194, 240);
   }

  .footer {
    position: fixed;
    height: 100px;
    width: 100%;
    bottom: 0;
    background: greenyellow;
    color: white;
  }
</style>
