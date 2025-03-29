<script lang="ts">
  interface FormData {
    email: string;
    password: string;
  }

  interface ApiResponse {
    success: boolean;
    message: string;
    user?: any;
    session_token?: string;
    detail?: string;
  }

  let formData: FormData = {
    email: '',
    password: '',
  };

  let errorMessages: { [key: string]: string } = {};
  let isSubmitting = false;

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.email.trim()) errors.email = 'El email es obligatorio';
    else if (!validateEmail(formData.email))
      errors.email = 'Por favor ingresa un email válido';

    if (!formData.password.trim())
      errors.password = 'La contraseña es obligatoria';

    errorMessages = errors;
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!validateForm()) return;

    isSubmitting = true;
    errorMessages = {};

    try {
      const payload: FormData = {
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const responseData: ApiResponse = await response.json();

      if (!response.ok) {
        if (responseData.detail) {
          errorMessages = { general: responseData.detail };
        } else {
          errorMessages = { general: 'Error durante el inicio de sesión' };
        }
        return;
      }

      if (responseData.session_token) {
        localStorage.setItem('session_token', responseData.session_token);
      }

      window.location.href = '/';
      formData = {
        email: '',
        password: '',
      };
    } catch (error) {
      errorMessages = {
        general: 'No se pudo iniciar sesión. Intenta nuevamente más tarde.',
      };
    } finally {
      isSubmitting = false;
    }
  };
</script>

<form
  on:submit|preventDefault={handleSubmit}
  class="space-y-4 text-gray-800 max-w-md mx-auto dark:text-darkText"
>
  <div>
    <label for="email" class="block text-sm font-medium text-gray-800 dark:text-darkText"
      >Email</label
    >
    <input
      id="email"
      type="email"
      bind:value={formData.email}
      required
      autocomplete="email"
      class="w-full bg-white dark:bg-darkBg  border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-lightColor dark:focus:ring-darkHover"
    />
    {#if errorMessages.email}
      <span class="text-red-500 text-sm">{errorMessages.email}</span>
    {/if}
  </div>

  <div>
    <label for="password" class="block text-sm font-medium text-gray-800 dark:text-darkText"
      >Contraseña</label
    >
    <input
      id="password"
      type="password"
      bind:value={formData.password}
      required
      autocomplete="new-password"
      class="w-full bg-white dark:bg-darkBg  border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-lightColor dark:focus:ring-darkHover"
    />
    {#if errorMessages.password}
      <span class="text-red-500 text-sm">{errorMessages.password}</span>
    {/if}
  </div>

  {#if errorMessages.general}
    <div class="text-red-500 text-center bg-red-100 p-2 rounded-lg">
      {errorMessages.general}
    </div>
  {/if}

  <div class="flex justify-center">
    <button
      type="submit"
      disabled={isSubmitting}
      class="text-xl w-auto text-center px-8 bg-[#D593D1] dark:bg-darkHover text-white py-2 rounded-2xl transition duration-300 ease-in-out hover:bg-[#b76aaf] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? 'Sending...' : 'Send'}
    </button>
  </div>
</form>
