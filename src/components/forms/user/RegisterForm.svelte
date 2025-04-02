<script lang="ts">
  import { tick } from 'svelte';
  import { verifyAccount } from '../../../lib/users';


  let showVerifySection = false;
  let verificationToken = "";
  let verificationMessage = "";


  interface FormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    phone: string;
  }

  interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
    detail?: string;
    session_token?: string;
  }

  let formData: FormData = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    phone: '',
  };

  let errorMessages: { [key: string]: string } = {};
  let isSubmitting = false;

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string): boolean =>
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.email.trim()) errors.email = 'El email es obligatorio';
    else if (!validateEmail(formData.email))
      errors.email = 'Por favor ingresa un email válido';

    if (!formData.password.trim())
      errors.password = 'La contraseña es obligatoria';
    else if (formData.password.length < 8)
      errors.password = 'La contraseña debe tener al menos 8 caracteres';

    if (!formData.firstName.trim())
      errors.firstName = 'El nombre es obligatorio';
    if (!formData.lastName.trim())
      errors.lastName = 'El apellido es obligatorio';
    if (!formData.birthDate)
      errors.birthDate = 'La fecha de nacimiento es obligatoria';
    if (!formData.phone.trim()) errors.phone = 'El teléfono es obligatorio';
    else if (!validatePhone(formData.phone))
      errors.phone = 'Por favor ingresa un número de teléfono válido';

    errorMessages = errors;
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
  if (isSubmitting) return;

  if (!validateForm()) return;

  isSubmitting = true;
  errorMessages = {};

  try {
    const payload = {
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      birth_date: new Date(formData.birthDate).toISOString().split('T')[0],
      phone: formData.phone,
    };

    const response = await fetch('http://localhost:8000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const responseData: ApiResponse = await response.json();

    console.log("Respuesta del backend:", response.status, responseData);

    if (response.ok) {
      const sessionToken =
        responseData.data?.session_token || responseData.session_token;

      if (sessionToken) {
        localStorage.setItem('session_token', sessionToken);
      }

      showVerifySection = true;
      await tick();
    } else {
      if (responseData.detail) {
        errorMessages = {
          general: typeof responseData.detail === 'string'
            ? responseData.detail
            : JSON.stringify(responseData.detail),
        };
      } else {
        errorMessages = {
          general: `Error durante el registro (código ${response.status})`,
        };
      }
    }
  } catch (error) {
    console.error("Error de red o inesperado:", error);
    errorMessages = {
      general: 'No se pudo registrar. Intenta nuevamente más tarde.',
    };
  } finally {
    isSubmitting = false;
  }
};




  async function handleVerifyToken() {
  if (!verificationToken.trim()) return;

  const success = await verifyAccount(verificationToken);

  if (success) {
    verificationMessage = "¡Cuenta verificada correctamente! Ahora podés iniciar sesión.";

    formData = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    phone: '',
  };

    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  } else {
    verificationMessage = "Token inválido o expirado. Verificá tu email.";
  }
}

</script>

<form
  on:submit|preventDefault={handleSubmit}
  class="space-y-4 text-gray-800 max-w-md mx-auto dark:text-darkText"
>
  <div>
    <label for="email" class="block text-sm font-medium text-gray-800 dark:text-darkText "
      >Email</label
    >
    <input
      id="email"
      type="email"
      bind:value={formData.email}
      required
      autocomplete="email"
      class="w-full bg-white dark:bg-darkBg border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-[#D593D1]"
    />
    {#if errorMessages.email}
      <span class="text-red-500 dark:bg-darkContainer dark:text-white text-sm">{errorMessages.email}</span>
    {/if}
  </div>

  <div>
    <label for="password" class="block text-sm font-medium text-gray-800 dark:text-darkText "
      >Password</label  
    >
    <input
      id="password"
      type="password"
      bind:value={formData.password}
      required
      autocomplete="new-password"
      class="w-full bg-white  dark:bg-darkBg  border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-[#D593D1]"
    />
    {#if errorMessages.password}
      <span class="text-red-500 dark:bg-darkContainer dark:text-white text-sm">{errorMessages.password}</span>
    {/if}
  </div>

  <div class="flex gap-4">
    <div class="w-1/2">
      <label for="firstName" class="block text-sm font-medium text-gray-800 dark:text-darkText "
        >Name</label
      >
      <input
        id="firstName"
        type="text"
        bind:value={formData.firstName}
        required
        autocomplete="given-name"
        class="w-full bg-white dark:bg-darkBg border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-[#D593D1]"
      />
      {#if errorMessages.firstName}
        <span class="text-red-500 dark:bg-darkContainer dark:text-white text-sm">{errorMessages.firstName}</span>
      {/if}
    </div>
    <div class="w-1/2">
      <label for="lastName" class="block text-sm font-medium text-gray-800 dark:text-darkText pl-1"
        >Last name</label
      >
      <input
        id="lastName"
        type="text"
        bind:value={formData.lastName}
        required
        autocomplete="family-name"
        class="w-full bg-white dark:bg-darkBg border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-[#D593D1]"
      />
      {#if errorMessages.lastName}
        <span class="text-red-500 dark:bg-darkContainer dark:text-white text-sm">{errorMessages.lastName}</span>
      {/if}
    </div>
  </div>

  <div>
    <label for="birthDate" class="block text-sm font-medium text-gray-800 dark:text-darkText"
      >Birthdate</label
    >
    <input
      id="birthDate"
      type="date"
      bind:value={formData.birthDate}
      required
      max={new Date().toISOString().split('T')[0]}
      class="w-full bg-white dark:bg-darkBg border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-[#D593D1]"
    />
    {#if errorMessages.birthDate}
      <span class="text-red-500 dark:bg-darkContainer dark:text-white text-sm">{errorMessages.birthDate}</span>
    {/if}
  </div>

  <div>
    <label for="phone" class="block text-sm font-medium text-gray-800 dark:text-darkText"
      >Phone</label
    >
    <input
      id="phone"
      type="tel"
      bind:value={formData.phone}
      required
      autocomplete="tel"
      class="w-full bg-white dark:bg-darkBg border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-[#D593D1]"
    />
    {#if errorMessages.phone}
      <span class="text-red-500 dark:bg-darkContainer dark:text-white text-sm">{errorMessages.phone}</span>
    {/if}
  </div>

  {#if errorMessages.general}
    <div class="text-red-500 text-center bg-red-100 p-2 rounded-lg dark:bg-darkContainer dark:text-white">
      {errorMessages.general}
    </div>
  {/if}

  <div class="flex justify-center">
    <button
      type="submit"
      disabled={isSubmitting}
      class="text-xl w-auto text-center px-8 bg-lightColor dark:bg-darkHover text-white py-2 rounded-2xl transition duration-300 ease-in-out hover:bg-[#b76aaf] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? 'Sending...' : 'Send'}
    </button>
  </div>

  {#if showVerifySection}
  <div class="mt-6">
    <label for="verificationToken" class="block text-sm font-medium text-gray-800 dark:text-darkText mb-1 pl-2">
      Enter the token by sending it to your email
    </label>
    <input
      id="verificationToken"
      type="text"
      bind:value={verificationToken}
      placeholder="Token"
      class="w-full bg-white dark:bg-darkBg border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-[#D593D1]"
    />

    <button
      type="button"
      on:click={handleVerifyToken}
      class="mt-3 w-full bg-[#ECE6F0] text-[#65558F] dark:bg-darkHover dark:text-white py-2 px-6 rounded-2xl shadow-md hover:bg-[#b76aaf] transition-all"
    >
      Enter token
    </button>

    {#if verificationMessage}
      <p class="mt-2 text-sm text-center text-green-600 dark:text-green-400">
        {verificationMessage}
      </p>
    {/if}
  </div>
{/if}

</form>
