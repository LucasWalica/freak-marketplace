<template>
  <h1>Hello App!</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    |
    <RouterLink to="/register">Go to Register</RouterLink>
    |
    <RouterLink to="/login">Go to Login</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>