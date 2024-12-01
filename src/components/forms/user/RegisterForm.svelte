<script lang="ts">
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
      const payload: FormData = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        birth_date: new Date(formData.birthDate).toISOString().split('T')[0],
        phone: formData.phone,
      };

      const response = await fetch(
        'http://localhost:8000/api/v1/users/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const responseData: ApiResponse = await response.json();

      if (!response.ok) {
        if (responseData.detail) {
          errorMessages = { general: responseData.detail };
        } else {
          errorMessages = { general: 'Error durante el registro' };
        }
        return;
      }

      if (responseData.data?.session_token) {
        localStorage.setItem('session_token', responseData.data.session_token);
      }

      window.location.href = '/';
      formData = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        birthDate: '',
        phone: '',
      };
    } catch (error) {
      errorMessages = {
        general: 'No se pudo registrar. Intenta nuevamente más tarde.',
      };
    } finally {
      isSubmitting = false;
    }
  };
</script>

<form
  on:submit|preventDefault={handleSubmit}
  class="space-y-4 text-gray-800 max-w-md mx-auto"
>
  <div>
    <label for="email" class="block text-sm font-medium text-gray-800"
      >Email</label
    >
    <input
      id="email"
      type="email"
      bind:value={formData.email}
      required
      autocomplete="email"
      class="w-full bg-white border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-[#D593D1]"
    />
    {#if errorMessages.email}
      <span class="text-red-500 text-sm">{errorMessages.email}</span>
    {/if}
  </div>

  <div>
    <label for="password" class="block text-sm font-medium text-gray-800"
      >Contraseña</label
    >
    <input
      id="password"
      type="password"
      bind:value={formData.password}
      required
      autocomplete="new-password"
      class="w-full bg-white border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-[#D593D1]"
    />
    {#if errorMessages.password}
      <span class="text-red-500 text-sm">{errorMessages.password}</span>
    {/if}
  </div>

  <div class="flex gap-4">
    <div class="w-1/2">
      <label for="firstName" class="block text-sm font-medium text-gray-800"
        >Nombre</label
      >
      <input
        id="firstName"
        type="text"
        bind:value={formData.firstName}
        required
        autocomplete="given-name"
        class="w-full bg-white border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-[#D593D1]"
      />
      {#if errorMessages.firstName}
        <span class="text-red-500 text-sm">{errorMessages.firstName}</span>
      {/if}
    </div>
    <div class="w-1/2">
      <label for="lastName" class="block text-sm font-medium text-gray-800"
        >Apellido</label
      >
      <input
        id="lastName"
        type="text"
        bind:value={formData.lastName}
        required
        autocomplete="family-name"
        class="w-full bg-white border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-[#D593D1]"
      />
      {#if errorMessages.lastName}
        <span class="text-red-500 text-sm">{errorMessages.lastName}</span>
      {/if}
    </div>
  </div>

  <div>
    <label for="birthDate" class="block text-sm font-medium text-gray-800"
      >Fecha de Nacimiento</label
    >
    <input
      id="birthDate"
      type="date"
      bind:value={formData.birthDate}
      required
      max={new Date().toISOString().split('T')[0]}
      class="w-full bg-white border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-[#D593D1]"
    />
    {#if errorMessages.birthDate}
      <span class="text-red-500 text-sm">{errorMessages.birthDate}</span>
    {/if}
  </div>

  <div>
    <label for="phone" class="block text-sm font-medium text-gray-800"
      >Teléfono</label
    >
    <input
      id="phone"
      type="tel"
      bind:value={formData.phone}
      required
      autocomplete="tel"
      class="w-full bg-white border border-gray-400 rounded-3xl p-2 focus:outline-none focus:ring-2 focus:ring-[#D593D1]"
    />
    {#if errorMessages.phone}
      <span class="text-red-500 text-sm">{errorMessages.phone}</span>
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
      class="text-xl w-auto text-center px-8 bg-[#D593D1] text-white py-2 rounded-2xl transition duration-300 ease-in-out hover:bg-[#b76aaf] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isSubmitting ? 'Sending...' : 'Send'}
    </button>
  </div>
</form>
