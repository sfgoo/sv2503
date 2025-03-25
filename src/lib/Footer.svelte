<script>
  export let year = new Date().getFullYear();
  export let companyName = "Моя Компания";
</script>

<footer class="footer">
  <div class="footer-content">
    <p>© {year} {companyName}. Все права защищены.</p>
  </div>
</footer>

<style>
  .footer {
    background: #343a40;
    color: white;
    padding: 2rem 0;
    margin-top: auto;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    text-align: center;
  }

  .footer p {
    margin: 0;
  }
</style>
