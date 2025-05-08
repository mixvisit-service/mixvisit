<script lang="ts">
  const releaseYear = 2024;
  const currentYear = new Date().getFullYear();
  const productYears = currentYear === releaseYear ? currentYear.toString() : `${releaseYear}-${currentYear}`;
</script>

<footer>
  <p>
    Copyright &copy; {productYears} MixVisitJS. All rights reserved.
    <a href="https://opensource.org/licenses/MIT" target="_blank">MIT - License</a>
  </p>
</footer>

<style>
  footer {
    text-align: center;
    word-wrap: break-word;
  }
</style>
