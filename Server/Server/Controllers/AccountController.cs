using Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers
{
    [Produces("application/json")]
    public class AccountController : Controller // Контроллер для аккаунтов
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }

        [HttpPost]
        [Route("api/account/register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] RegisterViewModel model) // Метод регистрации
        {
            if (ModelState.IsValid)
            {
                User user = new() { Email = model.Email, UserName = model.Email };
                var result = await _userManager.CreateAsync(user, model.Password);
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(user, "user");
                    await _signInManager.SignInAsync(user, false);
                    return Ok(new { message = "Новый пользователь добавлен", userName = model.Email });
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError(string.Empty, error.Description);
                    }
                    var errorMsg = new
                    {
                        message = "Пользователь не добавлен",
                        error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                    };
                    return Created("", errorMsg);
                }
            }
            else
            {
                var errorMsg = new
                {
                    message = "Неверные входные данные",
                    error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                };
                return Created("", errorMsg);
            }
        }

        [HttpPost]
        [Route("api/account/login")]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model) // метод авторизации
        {
            if (ModelState.IsValid)
            {
                var result =
                    await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);
                if (result.Succeeded)
                {
                    var user = await _userManager.FindByEmailAsync(model.Email);
                    IList<string>? roles = await _userManager.GetRolesAsync(user);
                    string? userRole = roles.FirstOrDefault();
                    return Ok(new { message = "Выполнен вход", userName = model.Email, userRole });
                }
                else
                {
                    ModelState.AddModelError("", "Неправильный логин и (или) пароль");
                    var errorMsg = new
                    {
                        message = "Вход не выполнен",
                        error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                    };
                    return Created("", errorMsg);
                }
            }
            else
            {
                var errorMsg = new
                {
                    message = "Вход не выполнен",
                    error = ModelState.Values.SelectMany(e => e.Errors.Select(er => er.ErrorMessage))
                };
                return Created("", errorMsg);
            }
        }

        [HttpPost]
        [Route("api/account/logoff")]
        public async Task<IActionResult> LogOff() // метод выхода из аккаунта
        {
            User usr = await GetCurrentUserAsync();
            if (usr == null)
            {
                return Unauthorized(new { message = "Сначала выполните вход" });
            }
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Выполнен выход", userName = usr.UserName });
        }

        [HttpGet]
        [Route("api/account/isauthenticated")]
        public async Task<IActionResult> IsAuthenticated() // метод проверки активности сессии
        {
            User usr = await GetCurrentUserAsync();
            if (usr == null)
            {
                return Unauthorized(new { message = "Вы Гость. Пожалуйста, выполните вход" });
            }
            IList<string> roles = await _userManager.GetRolesAsync(usr);
            string? userRole = roles.FirstOrDefault();
            return Ok(new { message = "Сессия активна", id = usr.Id, userName = usr.UserName, userRole });

        }
        private Task<User> GetCurrentUserAsync() => _userManager.GetUserAsync(HttpContext.User);
    }
}