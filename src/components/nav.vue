<template>
  <div id="navbar">
    <span class="nav-title">
      function-plot-GUI <span class="version"> v0.2 · </span>
      <a class="link" href="https://github.com/Linho1219/function-plot-GUI" target="_blank"
        >Github</a
      >
    </span>
  </div>
</template>

<style>
.nav-title {
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 15px;
  height: fit-content;
  text-align: left;
  margin: auto;
  font-size: 20px;
  font-weight: bold;
}
.version {
  opacity: 0.5;
  font-size: 0.8em;
}
.link {
  opacity: 0.5;
  font-size: 0.8em;
  text-decoration: none;
  color: var(--c-text);
}
.link:hover {
  opacity: 0.8;
  text-decoration: underline;
}
</style>
